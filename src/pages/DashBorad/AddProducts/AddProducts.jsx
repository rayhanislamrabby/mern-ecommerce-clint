

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FileText, Plus, Image as ImageIcon, X, Ruler, 
  Layers, Palette, Sparkles, UploadCloud, Info
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

const sizesList = ["M", "L", "XL", "XXL"];
const CATEGORIES = [
  "Panjabi", "Polo Shirt", "Casual Shirt", "Formal Shirt", "T-Shirt",
  "Pant", "Blazer", "Kurti", "Saree", "Tops", "Borka", "Watch",
  "Wallet", "Belt", "Perfume", "Sunglasses", "Boys Dress", "Girls Dress", "Toys"
];

const AddProduct = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const axiosSecure = useAxiosSecure();

  const imageKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const imageApi = `https://api.imgbb.com/1/upload?key=${imageKey}`;

  const selectedSizes = watch("sizes") || [];
  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const handleConfirmPublish = (data) => {
    if (!data.image || data.image.length === 0) return toast.error("Asset Required!");

    Swal.fire({
      title: "INITIATE PUBLISH?",
      text: "Synchronizing product data to live server.",
      icon: "info",
      iconColor: "#6366F1",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#1e293b",
      confirmButtonText: "YES, SYNC NOW",
      background: "#0f172a",
      color: "#fff",
      customClass: {
        popup: "rounded-[2rem] border border-white/10 shadow-2xl",
        title: "text-xs font-black tracking-[0.3em] uppercase",
      }
    }).then((result) => {
      if (result.isConfirmed) processPublish(data);
    });
  };

  const processPublish = async (data) => {
    const loadingToast = toast.loading("Syncing Data...");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const imgRes = await axios.post(imageApi, formData);

      const sizeChart = selectedSizes.reduce((acc, size) => {
        acc[size] = {
          chest: Number(data[`chest_${size}`] || 0),
          length: Number(data[`length_${size}`] || 0),
        };
        return acc;
      }, {});

      const product = {
        name: data.name, sku: data.sku, price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        category: data.category, color: data.color, fabric: data.fabric,
        washCare: data.washCare, description: data.description,
        sizes: selectedSizes, image: imgRes.data.data.display_url,
        createdAt: new Date().toISOString(), sizeChart, postEmail: user?.email,
      };

      await axiosSecure.post("/products", product);
      toast.success("Identity Published!", { id: loadingToast });
      reset();
      setImagePreview(null);
    } catch (err) {
      toast.error("Process Failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // Reusable styles for inputs
  const inputBase = "w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/30 outline-none focus:border-indigo-500 transition-all font-bold text-sm mb-4";
  const labelBase = "text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1 block";

  return (
    <div className="min-h-screen p-4 md:p-10 font-sans selection:bg-indigo-500 selection:text-white">
      <form onSubmit={handleSubmit(handleConfirmPublish)} className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
              NEW <span className="text-indigo-500 underline decoration-indigo-500/30">ARTIFACT.</span>
            </h1>
          </motion.div>
          <div className="bg-white/5 px-5 py-4 rounded-full border border-white/10 hidden md:block">
            <p className="text-[18px] font-black text-white opacity-40">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: General Info & Table */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* General Info Card */}
            <div className="relative p-[1px] rounded-[2rem] overflow-hidden group">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-purple-500/20" />
              <div className="relative bg-[#020617]/60 backdrop-blur-xl p-8 rounded-[1.95rem] border border-white/5">
                <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                  <FileText size={16} className="text-indigo-500" />
                  <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Metadata Configuration</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-x-8">
                  <div>
                    <label className={labelBase}>Product Identity</label>
                    <input {...register("name", { required: true })} placeholder="E.G. TITAN BLACK PANJABI" className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Serial SKU</label>
                    <input {...register("sku")} placeholder="SZ-UNIT-001" className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Category Cluster</label>
                    <select {...register("category", { required: true })} className={`${inputBase} appearance-none`}>
                      <option value="" className="bg-[#0f172a]">SELECT CLUSTER</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelBase}>Color Spectrum</label>
                    <input {...register("color")} placeholder="CARBON NEON" className={inputBase} />
                  </div>
                </div>
                <div>
                  <label className={labelBase}>Narrative / Description</label>
                  <textarea {...register("description")} placeholder="BRIEF PRODUCT STORY..." className={`${inputBase} h-20 resize-none`} />
                </div>
              </div>
            </div>

            {/* Ultra Compact Scale Table */}
            <div className="relative p-[1px] rounded-[2rem] overflow-hidden">
               <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
               <div className="relative bg-[#020617]/60 backdrop-blur-xl p-6 rounded-[1.95rem] border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Ruler size={14} className="text-indigo-500" />
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest italic">Scale Matrix (Size)</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-[9px] font-black text-white/20 uppercase text-center border-b border-white/5 pb-2 mb-4">
                    <div>Active</div><div>Tag</div><div>Chest (IN)</div><div>Length (IN)</div>
                  </div>
                  {sizesList.map(size => (
                    <div key={size} className="grid grid-cols-4 gap-4 items-center mb-3">
                      <div className="flex justify-center">
                        <input type="checkbox" value={size} {...register("sizes")} className="w-4 h-4 accent-indigo-500 bg-transparent border-white/10 rounded" />
                      </div>
                      <div className="text-white font-black text-xs text-center italic">#{size}</div>
                      <input type="number" {...register(`chest_${size}`)} placeholder="00" className="bg-white/5 border border-white/10 rounded-lg py-1 text-center text-white text-xs outline-none focus:border-indigo-500" />
                      <input type="number" {...register(`length_${size}`)} placeholder="00" className="bg-white/5 border border-white/10 rounded-lg py-1 text-center text-white text-xs outline-none focus:border-indigo-500" />
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Side: Media & Pricing */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Asset Upload */}
            <div className="relative p-[1px] rounded-[2rem] overflow-hidden group">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-b from-indigo-500/30 to-transparent" />
               <div className="relative bg-[#020617]/80 p-6 rounded-[1.95rem] border border-white/5 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon size={14} className="text-indigo-500" />
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Visual Asset</h3>
                  </div>
                  <div className="relative aspect-square rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-500/50">
                    {imagePreview ? (
                      <div className="relative w-full h-full p-2">
                        <img src={imagePreview} className="w-full h-full object-cover rounded-xl" />
                        <button type="button" onClick={() => { setImagePreview(null); setValue("image", null); }} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                        <UploadCloud size={30} className="mx-auto text-white/10" />
                        <p className="text-[9px] text-white/30 font-black uppercase mt-2">Drop Artifact</p>
                        <input type="file" {...register("image")} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* Specifications & Price */}
            <div className="bg-[#020617]/40 p-8 rounded-[2rem] border border-white/5 space-y-6">
              <div>
                <label className={labelBase}>Material Detail</label>
                <input {...register("fabric")} placeholder="E.G. 100% ORGANIC COTTON" className={inputBase} />
                <label className={labelBase}>Maintenance</label>
                <input {...register("washCare")} placeholder="HAND WASH ONLY" className={inputBase} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Sale (BDT)</label>
                  <input type="number" {...register("price", { required: true })} placeholder="0000" className={`${inputBase} text-indigo-400`} />
                </div>
                <div>
                  <label className={labelBase}>Reg (BDT)</label>
                  <input type="number" {...register("originalPrice")} placeholder="0000" className={inputBase} />
                </div>
              </div>
            </div>

            {/* Final Sync Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-indigo-600 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] text-white shadow-2xl shadow-indigo-500/20 transition-all hover:bg-indigo-500"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "SYNCING..." : "PUBLISH TO CLOUD"} <Sparkles size={16} className="animate-pulse" />
              </div>
            </motion.button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

