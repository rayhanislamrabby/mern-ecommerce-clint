import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { ArrowRight } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

const Accessories = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch products and filter by specific accessory categories
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["accessories-top10"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      // Filter products belonging to accessories categories and sort by newest first
      return res.data
        .filter(
          (p) =>
            p.category === "Accessories" ||
            p.category === "Watch" ||
            p.category === "Wallet",
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  });

  // Loading state display
  if (isLoading)
    return (
      <div className="py-7 text-center font-black text-[10px] tracking-widest text-zinc-700">
        LOADING ACCESSORIES...
      </div>
    );

  // Limit the results to the top 10 products only
  const topAccessories = products.slice(0, 10);

  return (
    <div className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 sm:mb-16">
          <h2 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em] mb-3">
            Just Landed
          </h2>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tighter  text-center">
            Essential <span className="text-blue-700">Accessories</span>
          </h2>
          <div className="h-1.5 w-12 bg-black mt-4"></div>
        </div>

        {/* Product Grid - Maximum 10 items */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
          {topAccessories.map((item) => (
            <div
              key={item._id}
              // Redirect to single product details page on click
              onClick={() => navigate(`/product/${item._id}`)}
              className="group cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square overflow-hidden bg-zinc-50 rounded-[2rem] border border-zinc-100 group-hover:border-blue-200 transition-all duration-500">
                <img
                  src={item.image}
                  className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                  alt={item.name}
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
              </div>

              {/* Product Information */}
              <div className="mt-5 text-center space-y-1">
                <h3 className="text-[10px] font-black text-black uppercase tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-lg font-[1000] text-black tracking-tighter antialiased">
                  ৳{item.price}
                </p>
                {/* Action Link visible on hover */}
                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-[8px] font-black tracking-[0.2em] text-blue-600 border-b border-blue-600 pb-1 uppercase">
                    Get Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no accessories are available */}
        {topAccessories.length === 0 && (
          <div className="py-20 text-center font-black text-zinc-300 tracking-[0.5em] text-[10px] uppercase">
            No Accessories Found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Accessories;
