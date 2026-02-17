import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Save,
  FileText,
  Image as ImageIcon,
  X,
  Ruler,
  Layers,
  Palette,
  ArrowLeft,
  Loader2,
  Plus,
} from "lucide-react"; 

import useAxiosSecure from "../../../hooks/useAxiosSecures";
import useAuth from "../../../hooks/useAuth";

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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const imageKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const imageApi = `https://api.imgbb.com/1/upload?key=${imageKey}`;

  const selectedSizes = watch("sizes") || [];
  const imageFile = watch("image");


  const { data: product, isLoading: dataLoading } = useQuery({
    queryKey: ["product-edit", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${id}`);
      return res.data;
    },
  });

 
  useEffect(() => {
    if (product) {
      const formattedData = { ...product };
    
      if (product.sizeChart) {
        Object.keys(product.sizeChart).forEach((size) => {
          formattedData[`chest_${size}`] = product.sizeChart[size].chest;
          formattedData[`length_${size}`] = product.sizeChart[size].length;
        });
      }
      reset(formattedData);
      setImagePreview(product.image);
    }
  }, [product, reset]);


  useEffect(() => {
    if (imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const updateMutation = useMutation({
    mutationFn: async (updatedBody) => {
     
      const { _id, ...cleanData } = updatedBody; 
      return await axiosSecure.patch(`/products/${id}`, cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      Swal.fire({
        title: "Updated Successfully!",
       
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      navigate("/dashboard/adminproducts");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Server Error 500", {
        position: "top-right",
      });
    },
  });

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Save Changes?",
      text: "You are about to update this product.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#F43F5E",
      confirmButtonText: "Yes, Update",
      position: "top-end",
    }).then(async (result) => {
      if (result.isConfirmed) {
        processUpdate(data);
      } else {
        Swal.fire({
          title: "Cancelled",
          icon: "info",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const processUpdate = async (data) => {
    const toastId = toast.loading("Updating Product...", {
      position: "top-right",
    });
    try {
      setLoading(true);
      let finalImageUrl = product.image;

     
      if (data.image && data.image[0] instanceof File) {
        const imgForm = new FormData();
        imgForm.append("image", data.image[0]);
        const res = await axios.post(imageApi, imgForm);
        finalImageUrl = res.data.data.display_url;
      }

      const sizeChart = selectedSizes.reduce((acc, size) => {
        acc[size] = {
          chest: Number(data[`chest_${size}`] || 0),
          length: Number(data[`length_${size}`] || 0),
        };
        return acc;
      }, {});

      const updatedProduct = {
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
        image: finalImageUrl,
        sizeChart,
        updatedBy: user?.email, 
        lastUpdated: new Date(),
      };

      updateMutation.mutate(updatedProduct);
      toast.dismiss(toastId);
    } catch (err) {
      toast.error("Process failed",err, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase tracking-tighter italic">
        Loading Product...
      </div>
    );

  return (
    <div className="min-h-screen pb-10 bg-[#F8FAFC] font-sans text-black">
      <div className="max-w-6xl mx-auto space-y-5 px-4 pt-6">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-[1000] text-black tracking-tighter uppercase italic leading-none">
              EDIT <span className="text-[#6366F1]">PRODUCT.</span>
            </h1>
            <p className="text-black text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-50">
              Admin: {user?.email}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-black hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={14} />
            <span className="text-[10px] font-black uppercase">
              Cancel & Exit
            </span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                <FileText size={16} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-black text-black uppercase tracking-widest">
                  Product Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-black ml-1">
                    Title
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-black outline-none focus:border-[#6366F1] focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-black ml-1">
                    SKU
                  </label>
                  <input
                    {...register("sku")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-black outline-none focus:border-[#6366F1] shadow-inner"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-black ml-1">
                    Category
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-black outline-none focus:border-[#6366F1] cursor-pointer appearance-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-black ml-1">
                    Color Shade
                  </label>
                  <input
                    {...register("color")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-black outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-black ml-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full px-5 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-[12px] font-bold text-black h-36 outline-none focus:border-[#6366F1] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Size & Measurements */}
            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                <Ruler size={16} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-black text-black uppercase tracking-widest italic">
                  Measurement Sync
                </h3>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-3xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] font-black text-black uppercase tracking-tighter">
                      <th className="py-5 px-6">Active</th>
                      <th className="py-5 px-6">Size Tag</th>
                      <th className="py-5 px-6 text-center">Chest (In)</th>
                      <th className="py-5 px-6 text-center">Length (In)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sizesList.map((size) => (
                      <tr
                        key={size}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-5 px-6">
                          <input
                            type="checkbox"
                            value={size}
                            {...register("sizes")}
                            className="w-6 h-6 accent-[#6366F1] rounded-lg cursor-pointer"
                          />
                        </td>
                        <td className="py-5 px-6 font-black text-black text-sm italic">
                          #{size}
                        </td>
                        <td className="py-5 px-6">
                          <input
                            type="number"
                            {...register(`chest_${size}`)}
                            className="w-24 mx-auto block p-3 bg-white border border-slate-200 rounded-xl text-center text-xs font-black text-indigo-600 outline-none focus:ring-4 focus:ring-indigo-50"
                          />
                        </td>
                        <td className="py-5 px-6">
                          <input
                            type="number"
                            {...register(`length_${size}`)}
                            className="w-24 mx-auto block p-3 bg-white border border-slate-200 rounded-xl text-center text-xs font-black text-indigo-600 outline-none focus:ring-4 focus:ring-indigo-50"
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
          <div className="lg:col-span-4 space-y-6 text-black">
            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon size={16} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-black text-black uppercase tracking-widest italic">
                  Gallery Preview
                </h3>
              </div>
              <div className="relative aspect-[4/5] border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 overflow-hidden flex items-center justify-center group transition-all duration-500 hover:border-[#6366F1]">
                {imagePreview ? (
                  <div className="w-full h-full p-2">
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover rounded-[2rem] shadow-xl"
                      alt="prev"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", null);
                      }}
                      className="absolute top-4 right-4 p-2 bg-black text-white rounded-full hover:bg-rose-600 transition-colors shadow-2xl active:scale-90"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center opacity-30 group-hover:opacity-100 transition-opacity">
                    <Plus size={32} className="mx-auto mb-2 text-black" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                      Update Media
                    </p>
                    <input
                      type="file"
                      {...register("image")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-black text-black uppercase tracking-widest italic">
                  Attributes
                </h3>
              </div>
              <div className="space-y-4">
                <input
                  {...register("fabric")}
                  placeholder="Fabric Material"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-black outline-none focus:border-[#6366F1]"
                />
                <input
                  {...register("washCare")}
                  placeholder="Wash Care Info"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-black outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Palette size={14} className="text-[#6366F1]" />
                <h3 className="text-[11px] font-black text-black uppercase tracking-widest italic">
                  Pricing (BDT)
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-black uppercase ml-1 opacity-40">
                    Sale Price
                  </span>
                  <input
                    type="number"
                    {...register("price")}
                    className="w-full px-5 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs font-[1000] text-[#6366F1] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-black uppercase ml-1 opacity-40">
                    Regular
                  </span>
                  <input
                    type="number"
                    {...register("originalPrice")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || updateMutation.isLoading}
              className="w-full bg-black hover:bg-[#6366F1] text-white py-6 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all duration-500 font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
