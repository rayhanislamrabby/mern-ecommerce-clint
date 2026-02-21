import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ChevronDown, Filter } from "lucide-react";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const AllProducts = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosPublic();

  // States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All"); // Price Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(35);

  // Tanstack Query
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    },
    staleTime: 1000 * 60 * 10,
  });

  const categories = useMemo(
    () => ["All", ...new Set(allData.map((item) => item.category))],
    [allData],
  );

  // --- Combined Filter Logic (Category + Price) ---
  const filteredProducts = useMemo(() => {
    let result = allData;

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (priceRange !== "All") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        result = result.filter(
          (item) => item.price >= min && item.price <= max,
        );
      } else {
        result = result.filter((item) => item.price >= min);
      }
    }

    return result;
  }, [selectedCategory, priceRange, allData]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center bg-white font-black text-black tracking-[.3em]">
        LOADING...
      </div>
    );

  return (
    <div className="bg-white min-h-screen pb-20 pt-10 font-sans uppercase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Header (Category + Price Toggle) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b border-zinc-100 pb-6">
          {/* Category List */}
          <div className="flex gap-6 overflow-x-auto w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={`cat-${cat}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`text-[13px] whitespace-nowrap font-black tracking-[0.2em] pb-1 transition-all border-b-2 ${
                  selectedCategory === cat
                    ? "border-black text-black"
                    : "border-transparent text-zinc-900 hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Range Selector */}

          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 ${
              priceRange !== "All"
                ? "bg-blue-50 border-blue-500 shadow-sm" // Filter active thakle blue hobe
                : "bg-zinc-50 border-zinc-100" // Default style
            }`}
          >
            <Filter size={12} className="text-zinc-700" />
            <span className="text-[9px] font-black text-zinc-700 tracking-widest">
              PRICE:
            </span>
            <select
              onChange={(e) => {
                setPriceRange(e.target.value);
                setCurrentPage(1);
              }}
              value={priceRange}
              className="text-[9px] font-[1000] bg-transparent outline-none cursor-pointer text-black"
            >
              <option value="All">ANY PRICE</option>
              <option value="0-500">UNDER ৳500</option>
              <option value="500-1000">৳500 - ৳1000</option>
              <option value="1000-2000">৳1000 - ৳2000</option>
              <option value="2000-5000">৳2000 - ৳5000</option>
              <option value="5000">ABOVE ৳5000</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="group cursor-pointer flex flex-col bg-white"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 rounded-2xl border border-zinc-100 group-hover:border-zinc-300 transition-all duration-500">
                <img
                  src={product.image}
                  className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  alt={product.name}
                />
              </div>

              <div className="mt-4 space-y-1 text-center">
                <h3 className="text-[12px] font-black text-black line-clamp-1 transition-colors duration-300 group-hover:text-red-600">
                  {product.name}
                </h3>
                <span className="text-[10px] font-black text-blue-500 tracking-[.3em] uppercase block mb-1">
                  {product.category}
                </span>
                <p className="text-xl font-[1000] text-black tracking-tighter antialiased">
                  ৳{product.price}
                </p>
                <div className="pt-2">
                  <span className="text-[8px] font-black tracking-[0.2em] text-zinc-400 border-b border-zinc-200 py-1 transition-all duration-300 group-hover:text-black group-hover:border-black">
                    VIEW DETAILS
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center font-black text-zinc-300 tracking-[.5em] text-xs">
            NO PRODUCTS MATCH YOUR FILTERS.
          </div>
        )}

        {/* Pagination & Show Selector */}
        <div className="mt-24 flex flex-col items-center gap-8">
          {totalPages > 1 && (
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={`page-${index}`}
                  onClick={() => {
                    setCurrentPage(index + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-9 h-9 rounded-full text-[9px] font-black transition-all ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-white text-black border border-zinc-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 bg-zinc-50 px-5 py-2 rounded-full border border-zinc-100">
            <span className="text-[8px] font-black text-zinc-700 tracking-widest">
              SHOW:
            </span>
            <select
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              value={itemsPerPage}
              className="text-[9px] font-black bg-transparent outline-none cursor-pointer text-black"
            >
              <option value="20">20 PRODUCTS</option>
              <option value="35">35 PRODUCTS</option>
              <option value="50">50 PRODUCTS</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
