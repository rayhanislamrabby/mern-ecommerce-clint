import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecures";


const AllProducts = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // States: Default 35 items per page
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(35); // By default 35

  // Tanstack Query for Fast Loading & Caching
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      // Latest products first
      return res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  // Unique key error fix and memoization for speed
  const categories = useMemo(() => ["All", ...new Set(allData.map((item) => item.category))], [allData]);
  
  const filteredProducts = useMemo(() => 
    selectedCategory === "All" ? allData : allData.filter((item) => item.category === selectedCategory)
  , [selectedCategory, allData]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return (
    <div className="h-screen flex justify-center items-center bg-white font-black text-black tracking-[.3em]">
      LOADING...
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 pt-10 font-sans uppercase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filters */}
        <div className="mb-12 flex justify-center gap-6 overflow-x-auto pb-4 scrollbar-hide border-b border-zinc-100">
          {categories.map((cat) => (
            <button
              key={`cat-${cat}`} // Unique Key Fix
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`text-[10px] font-black tracking-[0.2em] pb-1 transition-all border-b-2 ${
                selectedCategory === cat ? "border-black text-black" : "border-transparent text-zinc-600 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Compact Professional Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {currentProducts.map((product) => (
            <div
              key={product._id} // Unique Key Fix for list rendering
              onClick={() => navigate(`/product/${product._id}`)}
              className="group cursor-pointer flex flex-col bg-white"
            >
              {/* Image Section */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 rounded-2xl border border-zinc-100 group-hover:border-zinc-300 transition-all duration-500">
                {currentPage === 1 && (
                   <span className="absolute top-3 right-3 z-10 bg-blue-700 text-white px-2 py-0.5 rounded text-[7px] font-black tracking-tighter">NEW</span>
                )}
                <img
                  src={product.image}
                  loading="lazy"
                  className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  alt={product.name}
                />
              </div>

              {/* Info Section */}
              <div className="mt-4 space-y-1 text-center">
                {/* Hover effect: Name becomes Red */}
                <h3 className="text-[10px] font-black text-black line-clamp-1 transition-colors duration-300 group-hover:text-red-600">
                  {product.name}
                </h3>

                <p className="text-xl font-[1000] text-black tracking-tighter antialiased">
                  ৳{product.price}
                </p>

                <div className="pt-2">
                  {/* Hover effect: View Details becomes Deep Black */}
                  <span className="text-[8px] font-black tracking-[0.2em] text-zinc-400 border-b border-zinc-200 py-1 transition-all duration-300 group-hover:text-black group-hover:border-black">
                    VIEW DETAILS
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination & Items Per Page Selector */}
        <div className="mt-24 flex flex-col items-center gap-8">
          {totalPages > 1 && (
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={`page-${index}`} // Unique Key Fix
                  onClick={() => { setCurrentPage(index + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`w-9 h-9 rounded-full text-[9px] font-black transition-all ${
                    currentPage === index + 1 ? "bg-black text-white" : "bg-white text-black border border-zinc-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {/* User can change items per page: 20, 35, 50, 100, 200 */}
          <div className="flex items-center gap-3 bg-zinc-50 px-5 py-2 rounded-full border border-zinc-100">
            <span className="text-[8px] font-black text-zinc-400 tracking-widest">SHOW:</span>
            <select
              onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              value={itemsPerPage}
              className="text-[9px] font-black bg-transparent outline-none cursor-pointer text-black"
            >
              <option value="20">20 PRODUCTS</option>
              <option value="35">35 PRODUCTS (DEFAULT)</option>
              <option value="50">50 PRODUCTS</option>
              <option value="100">100 PRODUCTS</option>
              <option value="200">200 PRODUCTS</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;