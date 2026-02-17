import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecures';

const CategoryPage = () => {
    // URL থেকে ক্যাটাগরির নাম নেবে (যেমন: Panjabi)
    const { categoryName } = useParams(); 
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['categoryProducts', categoryName],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            
            // ডাটাবেজের সব প্রোডাক্ট থেকে শুধুমাত্র সিলেক্ট করা ক্যাটাগরি ফিল্টার করা হচ্ছে
            // এবং নতুন প্রোডাক্টগুলো সবার আগে দেখানোর জন্য reverse() করা হয়েছে
            const filtered = res.data.filter(
                (product) => product.category?.toLowerCase() === categoryName?.toLowerCase()
            );
            return filtered.reverse();
        },
    });

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
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-3">
                        Category Archive
                    </h2>
                    <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tighter uppercase text-center">
                        {categoryName} <span className="text-indigo-600">Collection</span>
                    </h1>
                    <div className="h-1.5 w-16 bg-black mt-5"></div>
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
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-[2rem] p-6 mb-5">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        loading="lazy"
                                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2 text-center px-1">
                                    <h3 className="text-[11px] sm:text-[12px] font-black text-black tracking-tight leading-tight group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-xl sm:text-2xl font-[1000] text-black tracking-tighter">
                                            ৳{product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-[10px] sm:text-[12px] text-gray-400 line-through font-bold">
                                                ৳{product.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <span className="text-[9px] font-black tracking-[0.2em] text-gray-700 group-hover:text-black border-b border-transparent group-hover:border-black transition-all pb-0.5">
                                            VIEW DETAILS
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* --- No Product Found State --- */
                    <div className="text-center py-40">
                        <p className="text-slate-400 font-black text-sm tracking-widest uppercase">
                            No Products available in {categoryName} right now.
                        </p>
                        <button 
                            onClick={() => navigate('/allproducts')}
                            className="mt-6 px-8 py-3 bg-black text-white text-[10px] font-black uppercase rounded-full"
                        >
                            Browse All Collection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;