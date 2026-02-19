import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Edit3,
  Trash2,
  Plus,
  Eye,
  User,
  Clock,
  Flame,
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
        icon: "success",
        title: "Deleted!",
        showConfirmButton: false,
        timer: 1000,
      });
      queryClient.invalidateQueries(["admin-products"]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const processedProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading)
    return (
      <div className="h-screen flex justify-center text-black items-center font-[1000] italic tracking-tighter">
        LOADING INVENTORY...
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-[#fafafa] min-h-screen font-sans uppercase">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-3xl font-[1000] tracking-tighter text-black italic leading-none">
              Inventory <span className="text-zinc-400">Control.</span>
            </h2>
            <p className="text-[9px] font-black text-zinc-700 tracking-[0.3em] mt-2">
              Manage products & track admin activity
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/addproducts")}
            className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={14} /> ADD NEW PRODUCT
          </button>
        </div>

        {/* Search Box */}
        <div className="relative mb-8 max-w-xl">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-black"
            size={18}
            strokeWidth={3}
          />
          <input
            type="text"
            placeholder="SEARCH BY PRODUCT NAME..."
            className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-3xl text-[11px] font-black text-black shadow-sm focus:ring-2 ring-indigo-100 outline-none transition-all placeholder:text-zinc-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="p-6 text-[10px] font-[1000] tracking-[0.2em] text-zinc-700 uppercase">
                    Product Details
                  </th>
                  <th className="p-6 text-[10px] font-[1000] tracking-[0.2em] text-zinc-700 uppercase">
                    Admin Activity
                  </th>
                  <th className="p-6 text-[10px] font-[1000] tracking-[0.2em] text-zinc-700 uppercase text-center">
                    Price
                  </th>
                  <th className="p-6 text-[10px] font-[1000] tracking-[0.2em] text-zinc-700 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {processedProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="group hover:bg-zinc-50/50 transition-all"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <img
                            src={product.image}
                            className="w-16 h-16 bg-zinc-100 rounded-2xl object-cover p-1 transition-transform group-hover:scale-105"
                            alt=""
                          />

                          {index === 0 && !searchTerm && (
                            <div className="absolute -top-2 -left-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
                              <Flame size={10} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-[1000] text-black italic tracking-tighter">
                              {product.name}
                            </p>
                            {index === 0 && !searchTerm && (
                              <span className="text-[7px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse">
                                LATEST
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[8px] font-black bg-zinc-700 px-2 py-0.5 rounded text-zinc-700 uppercase">
                              {product.category}
                            </span>
                            <span className="text-[8px] font-black bg-indigo-50 px-2 py-0.5 rounded text-indigo-500 uppercase">
                              {product.sku || "NO SKU"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <User size={10} className="text-zinc-700" />
                          <p className="text-[9px] font-black text-black lowercase">
                            <span className="text-zinc-700 uppercase mr-1">
                              Posted:
                            </span>
                            {product.postEmail || "system_admin"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={10} className="text-zinc-400" />
                          <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleString()
                              : "Date N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <p className="text-sm font-black text-black italic">
                        ৳{product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="text-[9px] text-zinc-700 line-through font-bold">
                          ৳{product.originalPrice}
                        </p>
                      )}
                    </td>

                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="p-3 text-zinc-700 hover:text-black hover:bg-white border border-transparent hover:border-zinc-200 rounded-2xl transition-all"
                        >
                          <Eye size={16} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/edit-product/${product._id}`)
                          }
                          className="p-3 text-zinc-700 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-indigo-100 rounded-2xl transition-all"
                        >
                          <Edit3 size={16} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-3 text-zinc-700 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-2xl transition-all"
                        >
                          <Trash2 size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {processedProducts.length === 0 && (
            <div className="p-20 text-center font-black text-zinc-700 tracking-widest text-[10px]">
              NO PRODUCTS FOUND IN INVENTORY.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
