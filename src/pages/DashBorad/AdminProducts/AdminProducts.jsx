import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Edit3,
  Trash2,
  Plus,
  Eye,
  User,
  Clock,
  Flame,
  Database,
  Box,
  LayoutDashboard,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

const AdminProducts = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/products/${id}`),
    onSuccess: () => {
      Swal.fire({
        title: "DELETED",
        icon: "success",
        background: "#000",
        color: "#fff",
        showConfirmButton: false,
        timer: 1000,
      });
      queryClient.invalidateQueries(["admin-products"]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "ARE YOU SURE?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1e293b",
      confirmButtonText: "YES, DELETE",
      background: "#0a0a0a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const processedProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading)
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-transparent">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-black tracking-[0.4em] text-white animate-pulse uppercase">
          Syncing Matrix...
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-10 min-h-screen text-white font-sans selection:bg-indigo-500 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center border-b border-white/10 pb-8 gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <LayoutDashboard className="text-indigo-500" size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-[1000] tracking-tighter italic uppercase leading-none">
                Inven<span className="text-indigo-500">tory.</span>
              </h2>
              <p className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase mt-2">
                Core System Access
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full md:w-80 group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="SEARCH ARTIFACT..."
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[12px] font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20 uppercase tracking-widest"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/dashboard/addproducts")}
              className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-white/5"
            >
              <Plus size={16} strokeWidth={4} /> ADD NEW PRODUCT
            </button>
          </div>
        </div>

        {/* --- MAIN TABLE AREA --- */}
        <div className="relative border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-8 text-[11px] font-black tracking-[0.3em] text-white/40 uppercase italic">
                    Product Asset
                  </th>
                  <th className="p-8 text-[11px] font-black tracking-[0.3em] text-white/40 uppercase italic text-center">
                    Admin Activity
                  </th>
                  <th className="p-8 text-[11px] font-black tracking-[0.3em] text-white/40 uppercase italic text-center">
                    Value
                  </th>
                  <th className="p-8 text-[11px] font-black tracking-[0.3em] text-white/40 uppercase italic text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {processedProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="group hover:bg-white/[0.03] transition-all"
                  >
                    {/* Product Cell */}
                    <td className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="relative shrink-0">
                          <img
                            src={product.image}
                            className="w-20 h-20 rounded-3xl object-cover border-2 border-white/10 p-1 group-hover:border-indigo-500/50 transition-all duration-500"
                            alt=""
                          />
                          {index === 0 && !searchTerm && (
                            <div className="absolute -top-2 -right-2 bg-orange-500 p-1.5 rounded-xl shadow-lg shadow-orange-500/40">
                              <Flame
                                size={12}
                                fill="white"
                                className="text-white"
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-[1000] italic tracking-tighter text-white uppercase group-hover:text-indigo-400 transition-colors">
                            {product.name}
                          </p>
                          <div className="flex gap-2">
                            <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg uppercase tracking-tighter border border-indigo-500/20">
                              {product.category}
                            </span>
                            <span className="text-[9px] font-black bg-white/5 text-white/40 px-3 py-1 rounded-lg uppercase">
                              {product.sku || "NO SKU"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Admin Log Cell */}
                    <td className="p-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/5 px-4 py-1.5 rounded-full border border-emerald-400/10">
                          <User size={12} strokeWidth={3} />
                          <p className="text-[11px] font-black lowercase">
                            {product.postEmail || "admin@gmail.com"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-white/30">
                          <Clock size={10} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleDateString(
                                  "en-GB",
                                )
                              : "21/02/2026"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pricing Cell */}
                    <td className="p-6 text-center">
                      <p className="text-2xl font-[1000] italic tracking-tighter text-white">
                        ৳{product.price}
                      </p>
                    </td>

                    {/* Actions Cell with Colorful Icons */}
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="p-3.5 bg-sky-500/10 text-sky-400 rounded-2xl hover:bg-sky-500 hover:text-white transition-all border border-sky-500/20 shadow-lg shadow-sky-500/5"
                          title="View Details"
                        >
                          <Eye size={18} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/edit-product/${product._id}`)
                          }
                          className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20 shadow-lg shadow-amber-500/5"
                          title="Edit Product"
                        >
                          <Edit3 size={18} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-3.5 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-lg shadow-rose-500/5"
                          title="Delete Product"
                        >
                          <Trash2 size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {processedProducts.length === 0 && (
          <div className="py-32 text-center">
            <Box
              size={40}
              className="mx-auto text-white/5 mb-4 animate-bounce"
            />
            <p className="text-[11px] font-[1000] uppercase tracking-[0.5em] text-white/20 italic">
              No Assets Found in Database
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
