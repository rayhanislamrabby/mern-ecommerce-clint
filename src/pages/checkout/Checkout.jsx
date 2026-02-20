import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { CartContext } from "../../context/AuthContext/CartContext/CartProvider";
import {
  CreditCard,
  Truck,
  ArrowLeft,
  Plus,
  Minus,
  ShieldCheck,
} from "lucide-react";

import { districts } from "./Districts";
import useAxiosSecure from "../../hooks/useAxiosSecures";

const Checkout = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, clearCart, isLoading } = useContext(CartContext);

  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cashondelivery");
  const [isCouponApplied, setIsCouponApplied] = useState(false); //  Button disable state

  //  Buy Now detect (single source of truth)
  const isBuyNow = !!location.state?.buyNow;

  const { register, handleSubmit, watch } = useForm({
    defaultValues: { district: "Dhaka" },
  });

  useEffect(() => {
    if (!isLoading) {
      const data = location.state?.cartItems || cart;
      if (data?.length) setItems(data);
      else navigate("/");
    }
  }, [isLoading, cart, location.state, navigate]);

  // quantity change
  const updateQty = (id, type) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const qty = item.quantity || 1;
          const newQty = type === "inc" ? qty + 1 : qty - 1;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      }),
    );
  };

  // ===== PRICE =====
  const subtotal = items.reduce((a, i) => a + i.price * (i.quantity || 1), 0);
  const shipping = watch("district") === "Dhaka" ? 80 : 120;
  const total = subtotal - discount + shipping;

  // ===== APPLY COUPON =====
  const applyCoupon = async () => {
    if (!coupon) return toast.error("Please enter a coupon code");
    if (isCouponApplied) return;

    try {
      const res = await axiosSecure.get(
        `/coupons/${coupon}?amount=${subtotal}`,
      );

      // usedCount update করা
      await axiosSecure.patch(`/coupons/update-count/${coupon}`);

      const d =
        res.data.discountType === "fixed"
          ? res.data.discountValue
          : (subtotal * res.data.discountValue) / 100;

      setDiscount(d);
      setIsCouponApplied(true);
      toast.success("Coupon Applied");
    } catch (err) {
      setDiscount(0);
      setIsCouponApplied(false);
      toast.error(err.response?.data?.message || "Invalid Coupon");
    }
  };

  // ===== ORDER SUBMIT =====
  const onSubmit = async (formData) => {
    const cartIdsForBackend = isBuyNow ? [] : items.map((i) => i._id);

    const orderData = {
      ...formData,
      items,
      subtotal,

      shippingFee: shipping,
      discount,

      couponCode: isCouponApplied ? coupon : null,
      totalAmount: total,
      paymentMethod,
      orderDate: new Date(),
      deliveryStatus: "pending",
      cartIds: cartIdsForBackend,
      isBuyNow,
    };

    try {
      // ================= COD =================
      if (paymentMethod === "cashondelivery") {
        const result = await Swal.fire({
          title: "Confirm Your Order?",
          text: `You have to pay ৳${total} on delivery.`,
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#000",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
        });

        if (!result.isConfirmed) return;

        const res = await axiosSecure.post("/orders", {
          ...orderData,
          paymentStatus: "unpaid",
          transactionId: null,
        });

        if (res.data?.insertedId) {
          if (!isBuyNow) {
            await clearCart();
          }
          Swal.fire("Success!", "Your order is placed.", "success");
          navigate("/");
        }
        return;
      }

      // ================= CARD PAYMENT =================
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price: total,
      });

      if (data?.clientSecret) {
        navigate("/payments", {
          state: { orderInfo: orderData, clientSecret: data.clientSecret },
        });
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error(
        err.response?.data?.message || "Order Failed! Server error 500.",
      );
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-12 px-4 text-black">
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12"
      >
        {/* LEFT FORM */}
        <div className="flex-1 space-y-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 font-bold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            Shipping Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {["name", "phone", "email", "thana", "zip"].map((f) => (
              <input
                key={f}
                {...register(f, { required: true })}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                className="border-2 border-black px-3 py-3 text-sm text-black w-full outline-none focus:bg-gray-50"
              />
            ))}

            <select
              {...register("district")}
              className="border-2 border-black px-3 py-3 text-sm text-black w-full outline-none"
            >
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <textarea
              {...register("address", { required: true })}
              placeholder="Full Address (House, Road, Area)"
              className="border-2 border-black px-3 py-3 text-sm text-black w-full h-24 md:col-span-2 outline-none"
            />
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="w-full lg:w-[420px] border-[3px] border-black p-6 space-y-4 bg-white shadow-[8px_8px_0px_#000]">
          <h2 className="text-xl font-black uppercase italic tracking-tighter border-b-2 border-black pb-2">
            Order Summary
          </h2>

          <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border-b border-gray-100 pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover border-2 border-black rounded-sm shadow-[3px_3px_0px_#ccc]"
                />

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-black truncate w-40">
                    {item.name}
                  </h4>
                  <p className="text-blue-600 font-black text-sm">
                    ৳{item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, "dec")}
                      className="border-2 border-black px-2 py-0.5 hover:bg-black hover:text-white transition-all"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="font-bold text-black text-sm">
                      {item.quantity || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, "inc")}
                      className="border-2 border-black px-2 py-0.5 hover:bg-black hover:text-white transition-all"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="text-right font-black">
                  <p className="text-sm">
                    ৳{item.price * (item.quantity || 1)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* COUPON SECTION - Updated Logic */}
          <div className="flex gap-2 pt-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              disabled={isCouponApplied}
              placeholder="Coupon code"
              className={`border-2 border-black px-3 py-2 w-full text-black font-bold uppercase outline-none ${isCouponApplied ? "bg-gray-100" : ""}`}
            />
            <button
              type="button"
              onClick={applyCoupon}
              disabled={isCouponApplied || !coupon}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                isCouponApplied
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-black"
              }`}
            >
              {isCouponApplied ? "Applied" : "Apply"}
            </button>
          </div>

          <div className="space-y-2 text-sm border-t-2 border-black pt-4 font-bold">
            <p className="flex justify-between">
              Subtotal: <span>৳{subtotal}</span>
            </p>
            <p className="flex justify-between">
              Delivery: <span>৳{shipping}</span>
            </p>
            {discount > 0 && (
              <p className="text-green-600 flex justify-between">
                Discount: <span>-৳{discount}</span>
              </p>
            )}
            <p className="text-2xl font-black flex justify-between border-t-2 border-black pt-2 uppercase italic">
              Total: <span>৳{total}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("cashondelivery")}
              className={`border-2 border-black p-3 flex flex-col items-center gap-1 transition-all ${
                paymentMethod === "cashondelivery"
                  ? "bg-black text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              <Truck size={20} />
              <span className="text-[10px] font-black uppercase">COD</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`border-2 border-black p-3 flex flex-col items-center gap-1 transition-all ${
                paymentMethod === "card"
                  ? "bg-black text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              <CreditCard size={20} />
              <span className="text-[10px] font-black uppercase">Card</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-black text-white flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-[5px_5px_0px_#ccc] active:scale-95"
          >
            {paymentMethod === "card" ? "Proceed to Payment" : "Confirm Order"}
            <ShieldCheck size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
