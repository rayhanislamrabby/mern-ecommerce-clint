import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Minus,
  Plus,
  ArrowRight,
  Palette,
  Layers,
  ShieldCheck,
  Truck,
  AlignLeft,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";
import { CartContext } from "../../context/AuthContext/CartContext/CartProvider";
import useAxiosSecure from "../../hooks/useAxiosSecures";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { addToCart } = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  const { data: allProducts = [], isLoading: isRelatedLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!product?.category,
  });

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter((item) => item.category === product.category && item._id !== id)
      .slice(0, 10);
  }, [allProducts, product, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setSelectedSize(null);
  }, [id]);

  const handleAction = (isBuyNow = false) => {
    if (!selectedSize) {
      Swal.fire({
        icon: "error",
        title: "Select Size",
        text: "Please choose a size first!",
        confirmButtonColor: "#000",
      });
      return;
    }
    const cartItem = {
      ...product,
      _id: `${product._id}-${selectedSize}`,
      originalId: product._id,
      size: selectedSize,
      quantity: quantity,
    };
    addToCart(cartItem);
    if (isBuyNow) navigate("/checkout");
    else
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Added to cart",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
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
            <div className="sticky top-24 bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden cursor-zoom-in">
              <div
                className="relative aspect-square overflow-hidden"
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
                SKU: {product.sku}
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

            {/* Color & Fabric Small Icons */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Palette size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black">
                  COLOR: {product.color || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black">
                  FABRIC: {product.fabric || "PREMIUM"}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <h3 className="text-[10px]  tracking-widest text-gray-700 font-extrabold">
                SELECT SIZE
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 text-[11px] font-[1000] transition-all rounded-xl ${selectedSize === size ? "bg-black text-white border-black" : "bg-white text-black border-zinc-200 hover:border-black"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Size Table - Just above Buy Buttons */}
            {product.sizeChart && (
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 max-w-xs">
                <div className="flex items-center gap-2 mb-2 text-zinc-600">
                  <Info size={12} />
                  <span className="text-[9px] font-black tracking-widest">
                    MEASUREMENTS (INCH)
                  </span>
                </div>
                <table className="w-full text-[10px] font-black">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-900">
                      <th className="pb-1 text-left">SIZE</th>
                      <th className="pb-1 text-center">CHEST</th>
                      <th className="pb-1 text-center">LENGTH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {Object.entries(product.sizeChart).map(([size, m]) => (
                      <tr
                        key={size}
                        className={
                          selectedSize === size ? "text-indigo-600" : ""
                        }
                      >
                        <td className="py-1.5 text-left italic">{size}</td>
                        <td className="py-1.5 text-center">{m.chest}</td>
                        <td className="py-1.5 text-center">{m.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
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
                  className="flex-1 bg-white border-2 border-black text-black font-black py-4 rounded-xl hover:bg-black hover:text-white transition-all text-[11px] tracking-widest"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={() => handleAction(true)}
                  className="flex-1 bg-black text-white font-black py-4 rounded-xl hover:bg-zinc-800 transition-all text-[11px] tracking-widest"
                >
                  BUY IT NOW
                </button>
              </div>
            </div>

            {/* Authentic Icons - Request অনুযায়ী */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-xl shadow-sm">
                <ShieldCheck size={18} className="text-indigo-600" />
                <span className="text-[9px] font-black  tracking-tighter">
                  100% AUTHENTIC
                  <br />
                  GUARANTEED
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-xl shadow-sm">
                <Truck size={18} className="text-indigo-600" />
                <span className="text-[9px] font-black tracking-tighter">
                  FASTEST HOME
                  <br />
                  DELIVERY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description - Compact niche */}
        <div className="mt-16 border-t border-zinc-100 pt-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-4 uppercase">
            <AlignLeft size={16} />
            <h2 className="text-sm font-black tracking-widest italic">
              Description
            </h2>
          </div>
          <p className="text-zinc-800 text-xs font-bold normal-case leading-relaxed">
            {product.description ||
              "Premium quality product with comfortable fabric and modern design."}
          </p>
        </div>

        {/* Related Products */}
        <div className="mt-20 border-t border-zinc-100 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-[1000] tracking-tighter italic">
              YOU MAY ALSO LIKE
            </h2>
            <button
              onClick={() => navigate("/allproducts")}
              className="text-[9px] font-black border-b border-black pb-0.5"
            >
              VIEW ALL
            </button>
          </div>

          {isRelatedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="animate-pulse bg-zinc-50 aspect-[3/4] rounded-xl"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-zinc-50 rounded-xl overflow-hidden mb-3 border border-zinc-100 group-hover:border-zinc-300 transition-all">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-[10px] font-black line-clamp-1 uppercase">
                      {item.name}
                    </h3>
                    <p className="font-black text-sm text-black">
                      ৳{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
