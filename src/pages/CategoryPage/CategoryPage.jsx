


import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react'; // Added useState and useMemo

import { Filter, ArrowLeft } from 'lucide-react'; // Added icons
import useAxiosSecure from '../../hooks/useAxiosSecures';

const CategoryPage = () => {
    const { categoryName } = useParams(); 
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Price filter-er state
    const [priceRange, setPriceRange] = useState("All");

    const { data: allProducts = [], isLoading, error } = useQuery({
        queryKey: ['categoryProducts', categoryName],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            const filtered = res.data.filter(
                (product) => product.category?.toLowerCase() === categoryName?.toLowerCase()
            );
            return filtered.reverse();
        },
    });

    // --- Price Filtering Logic ---
    const products = useMemo(() => {
        if (priceRange === "All") return allProducts;
        const [min, max] = priceRange.split("-").map(Number);
        return allProducts.filter(p => {
            if (max) return p.price >= min && p.price <= max;
            return p.price >= min; 
        });
    }, [priceRange, allProducts]);

    if (isLoading) return (
        <div className="h-96 flex justify-center items-center bg-white">
            <span className="loading loading-ring loading-lg text-indigo-600"></span>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 text-rose-500 font-black uppercase text-[10px]">
            Error loading {categoryName} collection
        </div>
    );

    return (
        <div className="bg-white min-h-screen py-12 sm:py-20 font-sans uppercase">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- Page Header --- */}
                <div className="flex flex-col items-center mb-10">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mb-4 flex items-center gap-2 text-[9px] font-black text-red-400 hover:text-black transition-all uppercase tracking-widest"
                    >
                        <ArrowLeft size={12}/> Back to Home
                    </button>
                    <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-3">
                        Category Archive
                    </h2>
                    <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tighter uppercase text-center">
                        {categoryName} <span className="text-indigo-600">Collection</span>
                    </h1>
                    <div className="h-1.5 w-16 bg-black mt-5 mb-8"></div>

                    {/* --- Blue Price Filter Section --- */}
                    <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all duration-300 ${
                        priceRange !== "All" 
                        ? "bg-blue-50 border-blue-500 shadow-sm" 
                        : "bg-gray-50 border-gray-100"
                    }`}>
                        <Filter size={12} className={priceRange !== "All" ? "text-blue-600" : "text-gray-400"} />
                        <span className={`text-[9px] font-black tracking-widest ${
                            priceRange !== "All" ? "text-blue-600" : "text-gray-400"
                        }`}>
                            PRICE RANGE:
                        </span>
                        <select
                            onChange={(e) => setPriceRange(e.target.value)}
                            value={priceRange}
                            className={`text-[9px] font-[1000] bg-transparent outline-none cursor-pointer ${
                                priceRange !== "All" ? "text-blue-700" : "text-black"
                            }`}
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

                {/* --- Products Grid --- */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
                        {products.map((product) => (
                            <div 
                                key={product._id} 
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="group cursor-pointer bg-white rounded-[2.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-[2rem] p-6 mb-5">
                                    <img 
                                        src={product.image} 
                                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                        alt={product.name}
                                    />
                                </div>

                                <div className="space-y-2 text-center px-1">
                                    <h3 className="text-[11px] sm:text-[12px] font-black text-black tracking-tight leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-xl sm:text-2xl font-[1000] text-black tracking-tighter">
                                            ৳{product.price}
                                        </span>
                                    </div>

                                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <span className="text-[9px] font-black tracking-[0.2em] text-blue-600 border-b border-blue-600 pb-0.5">
                                            GET DETAILS
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <p className="text-slate-400 font-black text-sm tracking-widest uppercase">
                            No matching products in this price range.
                        </p>
                        <button 
                            onClick={() => setPriceRange("All")}
                            className="mt-6 px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;