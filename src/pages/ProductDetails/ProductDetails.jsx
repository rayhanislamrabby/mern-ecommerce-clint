import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Minus,
  Plus,
  Palette,
  Layers,
  ShieldCheck,
  Truck,
  AlignLeft,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";

import { CartContext } from "../../context/AuthContext/CartContext/CartProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { addToCart } = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // 1. Fetch Main Product
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  const { data: allProducts = [], isLoading: isRelatedLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!product?.category,
  });

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(
        (item) =>
          item.category?.toLowerCase() === product.category?.toLowerCase() &&
          item._id !== product._id,
      )
      .slice(0, 10);
  }, [allProducts, product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setSelectedSize(null);
  }, [id]);

  const handleAction = (isBuyNow = false) => {
    if (!selectedSize) {
      Swal.fire({
        icon: "error",
        title: "SELECT SIZE",
        text: "Please choose a size first!",
        confirmButtonColor: "#000",
      });
      return;
    }

    const itemToProcess = {
      ...product,
      _id: `${product._id}-${selectedSize}`,
      originalId: product._id,
      size: selectedSize,
      quantity: quantity,
     
    };

    if (isBuyNow) {
      navigate("/checkout", {
        state: {
          cartItems: [itemToProcess],
          total: product.price * quantity,
          fromBuyNow: true,
        },
      });
    } else {
      addToCart(itemToProcess);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Added to cart",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    }
  };

  if (isProductLoading)
    return (
      <div className="h-screen flex justify-center items-center bg-white font-black text-black tracking-widest uppercase">
        LOADING...
      </div>
    );

  return (
    <div className="bg-white min-h-screen text-black pb-10 font-sans uppercase">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image Section */}
          <div className="flex-1">
            <div className="sticky top-24 bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden">
              <div
                className="relative aspect-square overflow-hidden cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.image}
                  className={`w-full h-full object-contain p-8 transition-transform duration-700 ${isZoomed ? "scale-[1.8] cursor-zoom-out" : "scale-100"}`}
                  alt={product.name}
                />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-6">
            <div>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded text-[9px] font-black tracking-[0.2em] mb-3 inline-block">
                {product.category}
              </span>
              <h1 className="text-3xl font-[1000] text-black tracking-tighter leading-tight">
                {product.name}
              </h1>
              <p className="text-[9px] font-black text-zinc-700 mt-1 tracking-widest uppercase">
                SKU: {product.sku || "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-4 border-y border-zinc-100 py-4">
              <span className="text-4xl font-[1000] tracking-tighter">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-red-500 line-through italic font-black">
                  ৳{product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Palette size={14} className="text-indigo-600" />
                <span className="text-[12px] font-black">
                  COLOR: {product.color || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-indigo-600" />
                <span className="text-[12px] font-black">
                  FABRIC: {product.fabric || "PREMIUM"}
                </span>
              </div>
            </div>

            {/* Minimal Size Selection Table */}
            <div className="space-y-4 pt-4">
              <h3 className="text-[12px] tracking-widest text-zinc-800 font-black uppercase">
                Select Size
              </h3>

              <div className="max-w-[250px]">
                {" "}
                {/* Table-tike choto rakhar jonno width limit */}
                <div className="border border-black rounded-lg overflow-hidden">
                  <table className="w-full text-[12px] font-bold bg-white">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="px-4 py-2 text-left bg-zinc-50 border-r border-black">
                          Size
                        </th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {product.sizes?.map((size) => (
                        <tr
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`cursor-pointer transition-all ${
                            selectedSize === size
                              ? "bg-black text-white"
                              : "bg-white text-black hover:bg-zinc-50"
                          }`}
                        >
                          <td className="px-4 py-2 border-r border-zinc-200 font-black">
                            {size}
                          </td>
                          <td className="px-4 py-2 text-center text-[10px]">
                            {selectedSize === size ? "SELECTED" : "SELECT"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Measurement Info (Table-er niche) */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 max-w-[350px]">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-zinc-800" />
                  <h4 className="text-[10px] font-black uppercase tracking-tighter">
                    Measurement Guide (Inches)
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-zinc-200 pt-2">
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-800 font-bold uppercase">
                      Size
                    </p>
                    <p className="text-[11px] font-black">
                      {selectedSize || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-800 font-bold uppercase">
                      Chest
                    </p>
                    <p className="text-[11px] font-black">
                      {selectedSize === "M"
                        ? "38-40"
                        : selectedSize === "L"
                          ? "41-43"
                          : selectedSize === "XL"
                            ? "44-46"
                            : "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-800 font-bold uppercase">
                      Length
                    </p>
                    <p className="text-[11px] font-black">
                      {selectedSize === "M"
                        ? "27"
                        : selectedSize === "L"
                          ? "28"
                          : selectedSize === "XL"
                            ? "29"
                            : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Description Section */}
            <div className="pt-3 border-t border-zinc-100 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft size={14} className="text-zinc-800" />
                <h3 className="text-[11px] font-[1000] tracking-widest uppercase">
                  Product Description
                </h3>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-700 font-medium normal-case">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center border-2 border-black w-fit rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-5 py-3 hover:bg-black hover:text-white border-r-2 border-black transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-8 font-black text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-5 py-3 hover:bg-black hover:text-white border-l-2 border-black transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAction(false)}
                  className="flex-1 bg-white border-2 border-black text-black font-black py-4 rounded-xl hover:bg-black hover:text-white transition-all text-[11px] tracking-widest uppercase"
                >
                  ADD TO BAG
                </button>
                <button
                  onClick={() => handleAction(true)}
                  className="flex-1 bg-black text-white font-black py-4 rounded-xl hover:bg-zinc-800 transition-all text-[11px] tracking-widest border-2 border-black shadow-xl uppercase"
                >
                  BUY IT NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- RELATED PRODUCTS SECTION (Fixed) --- */}
        <div className="mt-24 border-t border-zinc-100 pt-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-[1000] tracking-tighter italic uppercase">
              YOU MAY ALSO LIKE
            </h2>
            <button
              onClick={() => navigate("/allproducts")}
              className="text-[10px] font-black border-b-2 border-black pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all"
            >
              VIEW ALL COLLECTION
            </button>
          </div>

          {isRelatedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="animate-pulse space-y-4">
                  <div className="bg-zinc-100 aspect-[3/4] rounded-2xl"></div>
                  <div className="h-4 bg-zinc-100 w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-zinc-50 rounded-2xl overflow-hidden mb-4 border border-transparent group-hover:border-zinc-200 transition-all relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="bg-black text-white text-[8px] font-black text-center py-2 rounded-lg">
                        QUICK VIEW
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-[10px] font-black line-clamp-1 uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <p className="font-[1000] text-sm text-indigo-600">
                      ৳{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-zinc-400 text-[10px] font-black tracking-widest uppercase">
              No similar products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
