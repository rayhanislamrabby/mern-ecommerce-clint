import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecures";

const AllProducts = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(32);

  // Fetch Products
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      // Sorting: Latest products first
      return res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    },
  });

  const categories = ["All", ...new Set(allData.map((item) => item.category))];
  const filteredProducts =
    selectedCategory === "All"
      ? allData
      : allData.filter((item) => item.category === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleItemsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center bg-white font-black text-black">
        LOADING...
      </div>
    );

  return (
    <div className="bg-white min-h-screen pb-20 pt-10 font-sans uppercase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="mb-12 flex justify-center gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`text-[10px] font-black tracking-[0.2em] pb-1 transition-all border-b-2 ${
                selectedCategory === cat
                  ? "border-black text-black"
                  : "border-transparent text-gray-700 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {currentProducts.map((product, index) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50 overflow-hidden relative"
            >
              {/* NEW Badge - Only for the first page items */}
              {currentPage === 1 && (
                <div className="absolute top-6 right-6 z-10">
                  <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-[9px] font-black tracking-tighter">
                    NEW
                  </span>
                </div>
              )}

              {/* Image Section */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-2xl p-6">
                <img
                  src={product.image}
                  className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
                  alt={product.name}
                />
              </div>

              {/* Info Section */}
              <div className="mt-5 space-y-2 text-center">
                <h3 className="text-[11px] font-black tracking-tight text-black line-clamp-1 group-hover:text-red-600 transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Price - Extra Bold like your image */}
                <p className="text-2xl font-[1000] text-black tracking-tighter antialiased">
                  ৳{product.price}
                </p>

                <div className="pt-2">
                  <span className="text-[8px] font-black tracking-[0.2em] text-gray-900 group-hover:text-black border-b border-transparent group-hover:border-black transition-all pb-0.5">
                    VIEW DETAILS
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Pagination & Items Per Page */}
        <div className="mt-24 flex flex-col items-center gap-8">
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-20 hover:border-black transition-all"
              >
                <span className="text-sm font-black text-black">←</span>
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(index + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${
                      currentPage === index + 1
                        ? "bg-black text-white shadow-lg"
                        : "bg-white text-black border border-gray-200 hover:border-black"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-20 hover:border-black transition-all"
              >
                <span className="text-sm font-black text-black">→</span>
              </button>
            </div>
          )}

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-100 shadow-sm">
            <span className="text-[9px] font-black text-gray-400 tracking-[0.2em]">
              ITEMS PER PAGE:
            </span>
            <select
              onChange={handleItemsPerPage}
              value={itemsPerPage}
              className="text-[10px] font-black bg-transparent border-none outline-none cursor-pointer text-black"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="32">32</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
