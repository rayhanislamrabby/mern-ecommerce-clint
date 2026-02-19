import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecures";
import { Trash2, Edit3, Loader2, Calendar, Zap, X, Save, Layers, Globe, PowerOff } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null); 
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();

  const fetchCoupons = async () => {
    try {
      const res = await axiosSecure.get("/admin/coupons");
      setCoupons(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Vault access denied!");
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const onUpdateSubmit = async (data) => {
    try {
      const updatedData = { 
        ...data, 
        discountValue: parseFloat(data.discountValue), 
        minPurchase: parseFloat(data.minPurchase), 
        usageLimit: parseInt(data.usageLimit),
        isActive: data.isActive === "true" // Handle string from radio/select
      };
      await axiosSecure.patch(`/admin/coupons/update/${editingCoupon._id}`, updatedData);
      toast.success("Database Updated! ");
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) { toast.error("Update failed!"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0f172a]"><Loader2 className="animate-spin text-cyan-400" size={50} /></div>;

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 border-b-2 border-slate-800 pb-4 flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase text-white flex items-center gap-2 italic tracking-tighter">
          <Layers className="text-cyan-400" size={30} /> Coupon <span className="text-cyan-500">Vault</span>
        </h2>
        <div className="text-[15px] font-bold text-blue-200 bg-slate-900 px-3 py-1 border border-slate-700">
           TOTAL:  {coupons.length}
        </div>
      </div>

      {/* Grid - Small Cards (Modified) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="relative bg-slate-800 border-2 border-slate-700 p-4 shadow-lg hover:border-cyan-500 transition-all duration-300 group">
            
            {/* --- ONLINE / OFFLINE INDICATOR --- */}
            <div className={`absolute -top-2 -right-2 px-2 py-0.5 text-[8px] font-black uppercase border-2 border-black flex items-center gap-1 shadow-[2px_2px_0px_#000] z-20 ${coupon.isActive ? 'bg-green-500 text-black' : 'bg-rose-600 text-white'}`}>
              {coupon.isActive ? <Globe size={10} className="animate-pulse" /> : <PowerOff size={10} />}
              {coupon.isActive ? 'Online' : 'Offline'}
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-black text-white uppercase truncate">{coupon.code}</h3>
              <p className="text-[12px] text-cyan-400 font-bold tracking-widest uppercase">
                {coupon.discountType === 'percent' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} FLAT`}
              </p>
               <p className="text-red-500  ">{coupon.discountType}</p>
            </div>

            <div className="space-y-1.5 py-2 border-t border-slate-700 text-[9px] font-bold text-slate-400 uppercase">
              <div className="flex justify-between"><span>Usage:</span> <span className="text-white">{coupon.usedCount || 0}/{coupon.usageLimit}</span></div>
              <div className="flex justify-between"><span>Min Buy:</span> <span className="text-white">৳{coupon.minPurchase}</span></div>
              {/* Progress Mini Bar */}
              <div className="w-full h-1 bg-slate-900 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}></div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => { setEditingCoupon(coupon); reset({ ...coupon, isActive: coupon.isActive.toString() }); }}
                className="flex-1 py-2 bg-emerald-400 text-black font-black text-[9px] uppercase border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(coupon._id)}
                className="px-2 py-2 bg-rose-600 text-white border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-black hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- EDIT MODAL (Cyber Industrial) --- */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border-4 border-cyan-500 p-6 w-full max-w-lg shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-pop-in">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
              <h2 className="text-xl font-black uppercase text-white flex items-center gap-2 italic">
                <Zap size={20} className="text-cyan-400" /> Modify Node
              </h2>
              <button onClick={() => setEditingCoupon(null)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24} strokeWidth={3}/></button>
            </div>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase text-slate-400">
              <div className="col-span-2 space-y-1">
                <label className="text-cyan-400">Coupon Code</label>
                <input {...register("code")} className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-white outline-none focus:border-cyan-400 uppercase text-sm" />
              </div>

              <div className="space-y-1">
                <label>Expiry Date</label>
                <input type="date" {...register("expiryDate")} className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-white outline-none" />
              </div>

              <div className="space-y-1">
                <label>Limit</label>
                <input type="number" {...register("usageLimit")} className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-white outline-none" />
              </div>

              <div className="space-y-1">
                <label>Value</label>
                <input type="number" {...register("discountValue")} className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-white outline-none" />
              </div>

              <div className="space-y-1">
                <label>Min Buy</label>
                <input type="number" {...register("minPurchase")} className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-white outline-none" />
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                   <label className="text-cyan-400">Type</label>
                   <select {...register("discountType")} className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-white outline-none">
                     <option value="fixed">Fixed (৳)</option>
                     <option value="percent">Percent (%)</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-cyan-400">Status</label>
                   <select {...register("isActive")} className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-white outline-none">
                     <option value="true">Online</option>
                     <option value="false">Offline</option>
                   </select>
                </div>
              </div>

              <button type="submit" className="col-span-2 mt-4 py-4 bg-cyan-500 text-black font-black text-xs uppercase tracking-[0.3em] shadow-[5px_5px_0px_#000] hover:bg-white transition-all flex items-center justify-center gap-2">
                Update Records <Save size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: popIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ManageCoupons;