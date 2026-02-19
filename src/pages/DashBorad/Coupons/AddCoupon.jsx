// import React from "react";
// import { useForm } from "react-hook-form";
// import useAxiosSecure from "../../../hooks/useAxiosSecures";
// import toast from "react-hot-toast";
// import {
//   TicketPercent,
//   Calendar,
//   DollarSign,
//   ListOrdered,
//   ToggleRight,
// } from "lucide-react";

// const AddCoupon = () => {
//   const axiosSecure = useAxiosSecure();
//   const { register, handleSubmit, reset } = useForm({
//     defaultValues: {
//       isActive: true,
//       discountType: "fixed",
//     },
//   });

//   const onSubmit = async (data) => {
//     const couponData = {
//       ...data,
//       code: data.code.trim().toUpperCase(),
//       discountValue: parseFloat(data.discountValue),
//       minPurchase: parseFloat(data.minPurchase),
//       usageLimit: parseInt(data.usageLimit),
//       expiryDate: new Date(data.expiryDate).toISOString(),
//     };

//     try {
//       const res = await axiosSecure.post("/admin/add-coupon", couponData);
//       if (res.data.insertedId) {
//         toast.success("Coupon Added Successfully!");
//         reset();
//       }
//     } catch (error) {
//       toast.error("Failed to add coupon.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white min-h-screen">
//       {/* Header Section */}
//       <div className="mb-12 border-l-[10px] border-black pl-6">
//         <h2 className="text-5xl font-black uppercase tracking-tighter text-black italic">
//           Add New Coupon
//         </h2>
//         <p className="text-black text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-70">
//           Discount Management System
//         </p>
//       </div>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="grid grid-cols-1 md:grid-cols-2 gap-10"
//       >
//         {/* Coupon Code */}
//         <div className="space-y-3">
//           <label className="text-[13px] font-black uppercase tracking-widest text-black flex items-center gap-2">
//             <TicketPercent size={16} strokeWidth={3} /> Coupon Code
//           </label>
//           <input
//             {...register("code", { required: true })}
//             placeholder="SAVE100"
//             className="w-full p-5 border-[3px] border-black text-black font-black uppercase outline-none focus:bg-yellow-50 transition-all placeholder:text-gray-300"
//           />
//         </div>

//         {/* Expiry Date */}
//         <div className="space-y-3">
//           <label className="text-[13px] font-black uppercase tracking-widest text-black flex items-center gap-2">
//             <Calendar size={16} strokeWidth={3} /> Expiry Date
//           </label>
//           <input
//             type="date"
//             {...register("expiryDate", { required: true })}
//             className="w-full p-5 border-[3px] border-black text-black font-black outline-none focus:bg-yellow-50 transition-all"
//           />
//         </div>

//         {/* Discount Type */}
//         <div className="space-y-3">
//           <label className="text-[13px] font-black uppercase tracking-widest text-black flex items-center gap-2">
//             <DollarSign size={16} strokeWidth={3} /> Discount Type
//           </label>
//           <select
//             {...register("discountType", { required: true })}
//             className="w-full p-5 border-[3px] border-black text-black font-black outline-none bg-white appearance-none cursor-pointer focus:bg-yellow-50 transition-all"
//           >
//             <option value="fixed">Fixed Amount (৳)</option>
//             <option value="percentage">Percentage (%)</option>
//           </select>
//         </div>

//         {/* Discount Value */}
//         <div className="space-y-3">
//           <label className="text-[13px] font-black uppercase tracking-widest text-black flex items-center gap-2">
//             <DollarSign size={16} strokeWidth={3} /> Discount Value
//           </label>
//           <input
//             type="number"
//             {...register("discountValue", { required: true })}
//             placeholder="Amount/Percent"
//             className="w-full p-5 border-[3px] border-black text-black font-black outline-none focus:bg-yellow-50 transition-all placeholder:text-gray-300"
//           />
//         </div>

//         {/* Minimum Purchase */}
//         <div className="space-y-3">
//           <label className="text-[13px] font-black uppercase tracking-widest text-black flex items-center gap-2">
//             <ListOrdered size={16} strokeWidth={3} /> Min Purchase
//           </label>
//           <input
//             type="number"
//             {...register("minPurchase", { required: true })}
//             placeholder="৳0.00"
//             className="w-full p-5 border-[3px] border-black text-black font-black outline-none focus:bg-yellow-50 transition-all placeholder:text-gray-300"
//           />
//         </div>

//         {/* Usage Limit */}
//         <div className="space-y-3">
//           <label className="text-[13px] font-black uppercase tracking-widest text-black flex items-center gap-2">
//             <ListOrdered size={16} strokeWidth={3} /> Usage Limit
//           </label>
//           <input
//             type="number"
//             {...register("usageLimit", { required: true })}
//             placeholder="Maximum Uses"
//             className="w-full p-5 border-[3px] border-black text-black font-black outline-none focus:bg-yellow-50 transition-all placeholder:text-gray-300"
//           />
//         </div>

//         {/* Status Toggle */}
//         <div className="flex items-center gap-6 md:col-span-2 bg-black p-6 border-[3px] border-black">
//           <ToggleRight size={24} className="text-white" />
//           <label className="text-xs font-black uppercase tracking-[0.3em] text-white flex-1">
//             Activate this Coupon
//           </label>
//           <input
//             type="checkbox"
//             {...register("isActive")}
//             className="w-8 h-8 accent-white cursor-pointer"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="md:col-span-2 w-full py-6 bg-black text-white font-black text-sm uppercase tracking-[0.5em] hover:bg-gray-900 transition-all active:scale-[0.97] shadow-[8px_8px_0px_#ccc] border-[3px] border-black"
//         >
//           Publish Coupon
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddCoupon;



import React from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecures";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // ✅ SweetAlert2 Import
import { TicketPercent, Calendar, DollarSign, ListOrdered, ToggleRight, Sparkles, Send } from "lucide-react";
import useAuth from "../../../hooks/useAuth"; 

const AddCoupon = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); 
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { isActive: true, discountType: "fixed" },
  });

  const onSubmit = async (data) => {
    if (!user?.email) return toast.error("User authentication failed!");

    // ✅ SweetAlert2 Confirmation Before Publishing
    const confirmResult = await Swal.fire({
      title: "Confirm Coupon?",
      text: `Do you want to publish the coupon: ${data.code.toUpperCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Publish it!",
      background: "#fff",
      color: "#000",
      showClass: { popup: 'animate__animated animate__zoomIn' },
      hideClass: { popup: 'animate__animated animate__zoomOut' }
    });

    if (!confirmResult.isConfirmed) return;

    const couponData = {
      ...data,
      code: data.code.trim().toUpperCase(),
      discountValue: parseFloat(data.discountValue),
      minPurchase: parseFloat(data.minPurchase),
      usageLimit: parseInt(data.usageLimit),
      expiryDate: new Date(data.expiryDate).toISOString(),
      creatorEmail: user?.email,
      usedCount: 0,
      usedBy: [],
    };

    try {
      const res = await axiosSecure.post("/admin/add-coupon", couponData);
      if (res.data.insertedId) {
        Swal.fire({
            title: "Success!",
            text: "Coupon has been launched successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        reset();
      }
    } catch (error) {
      toast.error("Failed to add coupon.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white animate-fade-in">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between border-b-4 border-blue-600 pb-2">
        <div className="animate-slide-left">
            <h2 className="text-2xl font-black uppercase italic flex items-center gap-2 text-black">
               <Sparkles className="text-blue-600 animate-spin-slow" size={20} /> Add Coupon
            </h2>
            <p className="text-[9px] font-bold text-gray-700  tracking-[0.2em]">
                Verified Admin: <span className="text-blue-600">{user?.email}</span>
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-3 gap-5">
        
        {/* Compact Inputs with Black Text Color Fix */}
        {[
          { id: "code", label: "Code", icon: TicketPercent, placeholder: "SAVE50" },
          { id: "expiryDate", label: "Expiry", icon: Calendar, type: "date" },
          { id: "discountValue", label: "Value", icon: DollarSign, type: "number", placeholder: "0.00" },
          { id: "minPurchase", label: "Min Buy", icon: ListOrdered, type: "number", placeholder: "0" },
          { id: "usageLimit", label: "Limit", icon: ListOrdered, type: "number", placeholder: "100" },
        ].map((field) => (
          <div key={field.id} className="group animate-float">
            <label className="text-[10px] font-black uppercase mb-1 flex items-center gap-1.5 text-gray-700 group-focus-within:text-blue-600 transition-all">
              <field.icon size={12} strokeWidth={3} /> {field.label}
            </label>
            <input
              type={field.type || "text"}
              {...register(field.id, { required: true })}
              placeholder={field.placeholder}
              className="w-full p-2.5 border-2 border-black text-black font-bold uppercase outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-xs placeholder:text-gray-300 bg-white"
            />
          </div>
        ))}

        <div className="group animate-float">
          <label className="text-[10px] font-black uppercase mb-1 flex items-center gap-1.5 text-gray-700 group-focus-within:text-blue-600">
            <DollarSign size={12} strokeWidth={3} /> Type
          </label>
          <select
            {...register("discountType", { required: true })}
            className="w-full p-2.5 border-2 border-black text-black font-bold outline-none bg-white focus:border-blue-600 text-xs cursor-pointer"
          >
            <option value="fixed">Fixed (৳)</option>
            <option value="percentage">Percent (%)</option>
          </select>
        </div>

        {/* Status Toggle - Ultra Compact */}
        <div className="col-span-full flex items-center justify-between bg-blue-50/50 p-2 border-2 border-dashed border-blue-600 rounded-md hover:bg-blue-100 transition-all cursor-pointer group">
           <div className="flex items-center gap-2">
              <ToggleRight size={16} className="text-blue-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-black">Active Status</span>
           </div>
           <input 
              type="checkbox" 
              {...register("isActive")} 
              className="w-4 h-4 accent-blue-600 cursor-pointer"
           />
        </div>

        {/* --- PUBLISH BUTTON (Glow & Gradient Animation) --- */}
        <div className="col-span-full flex justify-end pt-4">
            <button
              type="submit"
              className="relative group px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right text-white font-black text-[11px] uppercase tracking-[0.2em] border-2 border-black transition-all duration-500 shadow-[5px_5px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Coupon <Send size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Internal Shimmer Animation */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>
            </button>
        </div>
      </form>

      {/* Extra Animations CSS */}
      <style>{`
        @keyframes shimmer {
          100% { left: 100%; }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddCoupon;