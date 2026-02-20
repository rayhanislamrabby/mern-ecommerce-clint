import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { CartContext } from "../../../context/AuthContext/CartContext/CartProvider";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const PaymentForm = ({ clientSecret, orderInfo, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { clearCart } = useContext(CartContext);
  const [cardComplete, setCardComplete] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements) throw new Error("Stripe not ready");
      if (!clientSecret) throw new Error("Payment not initialized");
      if (!cardComplete) throw new Error("Please complete your card details");

      const card = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card },
        },
      );

      if (error) throw new Error(error.message);
      if (paymentIntent.status !== "succeeded")
        throw new Error("Payment failed");

      const res = await axiosPublic.post("/orders", {
        ...orderInfo,
        transactionId: paymentIntent.id,
        paymentStatus: "paid",
      });

      if (!res.data.insertedId) throw new Error("Order storage failed");
      return true;
    },
    onSuccess: () => {
      if (!orderInfo?.isBuyNow) clearCart();

      Swal.fire({
        title: "Payment Successful!",
        text: "Your order has been placed successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Payment failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  const cardOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#000000",
        letterSpacing: "0.025em",
        fontFamily: "Inter, sans-serif",
        "::placeholder": { color: "#94a3b8" },
      },
      invalid: { color: "#ef4444" },
    },
    hidePostalCode: true,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-[#f8fafc]">
      <div className="w-full max-w-[480px] bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-black text-lg uppercase tracking-tight">
              <CreditCard size={22} /> <span>Pay with Card</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
              <Lock size={12} /> <span>Secure</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Label color black kora hoyeche */}
            <label className="text-[12px] font-black uppercase tracking-widest text-black">
              Credit or Debit Card
            </label>

            <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-blue-500 transition-all focus-within:bg-white focus-within:shadow-md">
              <CardElement
                options={cardOptions}
                onChange={(e) => setCardComplete(e.complete)}
              />
            </div>

            {/* Fixed Images */}
            <div className="flex items-center gap-3 mt-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                className="h-3 md:h-4 object-contain"
                alt="Visa"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                className="h-6 md:h-7 object-contain"
                alt="Mastercard"
              />
              <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Verified Provider
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-black rounded-xl p-6 flex justify-between items-center text-white">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Total Amount
            </span>
            <span className="text-3xl font-black italic tracking-tighter text-blue-400">
              ৳{price}
            </span>
          </div>

          {/* Blue Button with Hover Effect */}
          <button
            type="submit"
            disabled={!stripe || !clientSecret || !cardComplete || isPending}
            className="w-full py-5 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 shadow-lg shadow-blue-100"
          >
            {isPending ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              <>Confirm & Pay ৳{price}</>
            )}
            <ShieldCheck size={20} />
          </button>

          <div className="flex flex-col items-center gap-1">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed text-center">
              Your data is protected by Stripe 256-bit encryption.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
