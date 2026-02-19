import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  PackagePlus,
  FileText,
  Plus,
  Image as ImageIcon,
  Lock,
  X,
  Ruler,
  Layers,
  Palette,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

const sizesList = ["M", "L", "XL", "XXL"];

const CATEGORIES = [
  "Panjabi",
  "Polo Shirt",
  "Casual Shirt",
  "Formal Shirt",
  "T-Shirt",
  "Pant",
  "Blazer",
  "Kurti",
  "Saree",
  "Tops",
  "Borka",
  "Watch",
  "Wallet",
  "Belt",
  "Perfume",
  "Sunglasses",
  "Boys Dress",
  "Girls Dress",
  "Toys",
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
    if (!data.image || data.image.length === 0)
      return toast.error("Please upload an image");

    Swal.fire({
      title: "PUBLISH THIS PRODUCT?",
      text: "This action will sync the product to your live inventory.",
      icon: "question",
      iconColor: "#6366F1",
      position: "bottom",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#1e293b",
      confirmButtonText: "YES, PUBLISH NOW",
      cancelButtonText: "NO, CANCEL",
      background: "#ffffff",
      heightAuto: false,
      customClass: {
        popup: "rounded-t-[3rem] p-8 shadow-2xl border-t-4 border-[#6366F1]",
        title:
          "text-[14px] font-[1000] text-black tracking-widest italic uppercase",
        htmlContainer:
          "text-[10px] font-bold text-slate-500 uppercase tracking-tight",
        confirmButton:
          "w-full py-4 rounded-2xl text-[11px] font-black tracking-widest uppercase mb-2",
        cancelButton:
          "w-full py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        processPublish(data);
      }
    });
  };

  const processPublish = async (data) => {
    const loadingToast = toast.loading("Publishing product...");
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
        name: data.name,
        sku: data.sku,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        category: data.category,
        color: data.color,
        fabric: data.fabric,
        washCare: data.washCare,
        description: data.description,
        sizes: selectedSizes,
        image: imgRes.data.data.display_url,
        createdAt: new Date().toISOString(),
        sizeChart,
        postEmail: user?.email,
      };

      await axiosSecure.post("/products", product);
      toast.success("Product Published Successfully!", { id: loadingToast });
      reset();
      setImagePreview(null);
    } catch (err) {
      toast.error("Publish failed. Try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-[#F8FAFC] font-sans">
      <div className="max-w-6xl mx-auto space-y-5 px-4 pt-6 text-black">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-[1000] text-black tracking-tighter uppercase italic leading-none">
              ADD <span className="text-[#6366F1]">PRODUCT.</span>
            </h1>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">
              #Inventory #Control
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Lock size={10} className="text-[#6366F1]" />
            <span className="text-[9px] font-black  tracking-tight">
              {user?.email}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleConfirmPublish)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <FileText size={16} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-[1000] uppercase tracking-widest">
                  General Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                    Product Title
                  </label>
                  <input
                    {...register("name", { required: true })}
                    placeholder="e.g. Premium Silk Panjabi"
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-black outline-none focus:ring-2 ring-indigo-50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                    SKU ID
                  </label>
                  <input
                    {...register("sku")}
                    placeholder="e.g. SZ-2024-001"
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-black outline-none focus:ring-2 ring-indigo-50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-black outline-none focus:ring-2 ring-indigo-50"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                    Color Shade
                  </label>
                  <input
                    {...register("color")}
                    placeholder="Midnight Black"
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-black outline-none focus:ring-2 ring-indigo-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                  Product Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-[1.5rem] text-[11px] font-bold text-black h-32 outline-none focus:ring-2 ring-indigo-50"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Ruler size={16} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-[1000] uppercase tracking-widest">
                  Size & Measurements
                </h3>
              </div>
              <div className="overflow-hidden border border-slate-50 rounded-2xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-4 px-5">Active</th>
                      <th className="py-4 px-5">Size TAG</th>
                      <th className="py-4 px-5 text-center">Chest (In)</th>
                      <th className="py-4 px-5 text-center">Length (In)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sizesList.map((size) => (
                      <tr
                        key={size}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <input
                            type="checkbox"
                            value={size}
                            {...register("sizes")}
                            className="w-5 h-5 accent-[#6366F1] rounded-lg cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-5 font-[1000] text-black text-sm italic">
                          #{size}
                        </td>
                        <td className="py-4 px-5">
                          <input
                            type="number"
                            placeholder="00"
                            {...register(`chest_${size}`)}
                            className="w-20 mx-auto block p-3 bg-slate-50 border-none rounded-xl text-center text-xs font-black outline-none focus:ring-2 ring-indigo-100"
                          />
                        </td>
                        <td className="py-4 px-5">
                          <input
                            type="number"
                            placeholder="00"
                            {...register(`length_${size}`)}
                            className="w-20 mx-auto block p-3 bg-slate-50 border-none rounded-xl text-center text-xs font-black outline-none focus:ring-2 ring-indigo-100"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon size={16} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-[1000] uppercase tracking-widest italic">
                  Product Media
                </h3>
              </div>
              <div className="relative aspect-[4/5] border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center bg-slate-50 overflow-hidden group hover:border-indigo-200 transition-all">
                {imagePreview ? (
                  <div className="w-full h-full relative p-2">
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover rounded-[1.5rem]"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", null);
                      }}
                      className="absolute top-4 right-4 p-2 bg-black text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Plus size={24} className="text-slate-300 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Drop Image
                    </p>
                    <input
                      type="file"
                      {...register("image")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1 text-black">
                <Layers size={14} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-[1000] uppercase tracking-widest italic">
                  Specifications
                </h3>
              </div>
              <input
                {...register("fabric")}
                placeholder="Fabric Material"
                className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-black outline-none focus:ring-2 ring-indigo-50"
              />
              <input
                {...register("washCare")}
                placeholder="Care Instructions"
                className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-black outline-none focus:ring-2 ring-indigo-50"
              />
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-2 mb-5 text-black">
                <Palette size={14} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-[1000] uppercase tracking-widest italic">
                  Pricing (BDT)
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Sale
                  </span>
                  <input
                    type="number"
                    {...register("price", { required: true })}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-black text-[#6366F1] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Reg
                  </span>
                  <input
                    type="number"
                    {...register("originalPrice")}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-[#6366F1] text-white py-6 rounded-[2.5rem] flex items-center justify-center gap-3 transition-all duration-500 font-black text-[12px] uppercase tracking-[0.3em] shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Publish Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
