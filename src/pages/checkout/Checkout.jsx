import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecures";
import { districts } from "./Districts";
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
  MapPin,
} from "lucide-react";

const Checkout = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cart,
    clearCart,
    isLoading: contextLoading,
  } = useContext(CartContext);

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cashondelivery");

  const { register, handleSubmit, watch } = useForm({
    defaultValues: { district: "Dhaka" },
  });

  useEffect(() => {
    if (!contextLoading) {
      const items = location.state?.cartItems || cart;
      if (items && items.length > 0) {
        setCheckoutItems(items);
      } else {
        navigate("/");
      }
    }
  }, [contextLoading, cart, location.state, navigate]);

  const cartTotal = checkoutItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );
  const selectedDistrict = watch("district");
  const deliveryCharge = selectedDistrict === "Dhaka" ? 80 : 120;
  const grandTotal = cartTotal - discount + deliveryCharge;

  // --- COUPON LOGIC (WORKABLE) ---
  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error("PLEASE ENTER A CODE");
    try {
      const res = await axiosSecure.get(`/coupons/${couponCode.toUpperCase()}`);
      if (res.data) {
        const amount = (cartTotal * res.data.percentage) / 100;
        setDiscount(amount);
        toast.success(`${res.data.percentage}% DISCOUNT APPLIED`);
      }
    } catch (err) {
      setDiscount(0);
      toast.error("INVALID OR EXPIRED COUPON");
    }
  };

  const updateQty = (id, type) => {
    const updated = checkoutItems.map((item) => {
      if (item._id === id) {
        const newQty =
          type === "inc" ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCheckoutItems(updated);
  };

  const onOrderSubmit = async (formData) => {
    try {
      const orderData = {
        ...formData,
        items: checkoutItems,
        subtotal: cartTotal,
        discount,
        shippingFee: deliveryCharge,
        totalAmount: grandTotal,
        paymentMethod,
        status: "pending",
        orderDate: new Date(),
      };

      if (paymentMethod === "cashondelivery") {
        const res = await axiosSecure.post("/orders", orderData);
        if (res.data.insertedId) {
          if (!location.state?.fromBuyNow) clearCart();
          Swal.fire({
            title: "SUCCESS",
            text: "ORDER PLACED!",
            icon: "success",
            confirmButtonColor: "#000",
          });
          navigate("/");
        }
      } else {
        // --- STRIPE REDIRECT ---
        navigate("/payment/stripe", {
          state: {
            orderInfo: orderData,
            fromBuyNow: location.state?.fromBuyNow,
          },
        });
      }
    } catch (err) {
      toast.error("ORDER PROCESSING FAILED");
    }
  };

  if (contextLoading)
    return (
      <div className="h-screen flex items-center justify-center font-bold tracking-widest uppercase">
        Initializing Checkout...
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-6 md:py-12 px-4 font-sans text-black uppercase tracking-tighter">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto border border-zinc-300">
        <form
          onSubmit={handleSubmit(onOrderSubmit)}
          className="flex flex-col lg:flex-row"
        >
          {/* LEFT: SHIPPING */}
          <div className="flex-1 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-zinc-300">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[10px] font-bold mb-8 text-red-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} /> BACK
            </button>

            <h2 className="text-xl font-black mb-8 italic">
              01. SHIPPING INFORMATION
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold">Full Name *</label>
                <input
                  {...register("name", { required: true })}
                  className="w-full p-2.5 border border-zinc-300 outline-none text-[11px] font-bold focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Phone Number *</label>
                <input
                  {...register("phone", { required: true })}
                  className="w-full p-2.5 border border-zinc-300 outline-none text-[11px] font-bold focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Email Address *</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="w-full p-2.5 border border-zinc-300 outline-none text-[11px] font-bold focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">District *</label>
                <select
                  {...register("district")}
                  className="w-full p-2.5 border border-zinc-300 outline-none text-[11px] font-bold bg-white"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">
                  Thana / Upazila *
                </label>
                <input
                  {...register("thana", { required: true })}
                  className="w-full p-2.5 border border-zinc-300 outline-none text-[11px] font-bold focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Zip Code *</label>
                <input
                  {...register("zipCode", { required: true })}
                  placeholder="e.g. 1200"
                  className="w-full p-2.5 border border-zinc-300 outline-none text-[11px] font-bold focus:border-black"
                />
              </div>

              {/* Boro Address Field */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold">
                  Full Address (House, Road, Area) *
                </label>
                <textarea
                  {...register("address", { required: true })}
                  className="w-full p-3 border border-zinc-300 outline-none text-[11px] font-bold h-24 resize-none focus:border-black"
                  placeholder="Enter your detailed delivery address..."
                />
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="w-full lg:w-[400px] p-6 md:p-10 flex flex-col bg-white">
            <h2 className="text-xl font-black mb-8 italic">
              02. ORDER SUMMARY
            </h2>

            <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto border-b border-zinc-200 pb-4">
              {checkoutItems.map((item) => (
                <div key={item._id} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    className="w-10 h-12 object-cover border border-zinc-200"
                    alt=""
                  />
                  <div className="flex-1">
                    <h4 className="text-[9px] font-bold truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center border border-zinc-300 w-fit mt-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item._id, "dec")}
                        className="px-1 border-r border-zinc-300"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="px-2 text-[10px] font-bold">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item._id, "inc")}
                        className="px-1 border-l border-zinc-300"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-black">
                    ৳{item.price * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            {/* COUPON BOX */}
            <div className="flex mb-6 border border-zinc-300 p-1 h-11 focus-within:border-black transition-all">
              <input
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="PROMO CODE"
                className="flex-1 outline-none text-[10px] font-bold px-3 uppercase bg-transparent"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-black text-white px-4 text-[9px] font-bold hover:bg-zinc-800 transition-all uppercase"
              >
                Claim
              </button>
            </div>

            {/* CALCULATIONS */}
            <div className="space-y-2 text-[11px] font-bold mb-8">
              <div className="flex justify-between text-zinc-700">
                <span>SUBTOTAL</span>
                <span>৳{cartTotal}</span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>SHIPPING FEE</span>
                <span>৳{deliveryCharge}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-blue-700">
                  <span>COUPON DISCOUNT</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              <div className="pt-4 flex justify-between text-2xl font-[1000] italic border-t border-zinc-300 text-black">
                <span>TOTAL</span>
                <span className="text-blue-700">৳{grandTotal}</span>
              </div>
            </div>

            {/* PAYMENT & STRIPE */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cashondelivery")}
                  className={`flex items-center justify-center rounded-2xl gap-2 py-3 border text-[10px] font-bold transition-all ${paymentMethod === "cashondelivery" ? "bg-black text-white border-black" : "border-zinc-300 hover:border-black"}`}
                >
                  <Truck size={20} /> Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center rounded-2xl justify-center  gap-2 py-3 border text-[11px] font-bold transition-all ${paymentMethod === "card" ? "bg-blue-700 text-white border-blue-700" : "border-zinc-300 hover:border-black"}`}
                >
                  <CreditCard size={20} /> Card
                </button>
              </div>

              <button
                type="submit"
                className={`w-full py-4 font-black text-[11px] rounded-2xl tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${paymentMethod === "card" ? "bg-blue-700 text-white" : "bg-black text-white"}`}
              >
                {paymentMethod === "card" ? "PROCEED TO PAYMENT" : "PLACE ORDER"}
                <ShieldCheck size={16} />
              </button>
            </div>

            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
