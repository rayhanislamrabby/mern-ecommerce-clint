// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecures";

// const TopProducts = () => {
//   const navigate = useNavigate();
//   const axiosSecure = useAxiosSecure();
//   const {
//     data: products = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["topProducts"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/products");

//       return res.data.reverse().slice(0, 8);
//     },
//   });

//   if (isLoading)
//     return (
//       <div className="h-96 flex justify-center items-center bg-white">
//         <span className="loading loading-ring loading-lg text-indigo-600"></span>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center py-20 text-rose-500 font-bold uppercase text-[10px]">
//         Error loading collection
//       </div>
//     );

//   return (
//     <div className="bg-white py-12 sm:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="flex flex-col items-center mb-12 sm:mb-16">
//           <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-3">
//             New Arrivals
//           </h2>
//           <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tighter uppercase text-center">
//             Top <span className="text-indigo-600">Collection</span>
//           </h2>
//           <div className="h-1.5 w-12 bg-black mt-4"></div>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-10">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               onClick={() => navigate(`/product/${product._id}`)}
//               className="group cursor-pointer bg-white rounded-2xl p-2 sm:p-4 border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
//             >
//               {/* Image Container - Size Controlled */}
//               <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-xl mb-4">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-full object-contain p-3 sm:p-6 transition-transform duration-700 group-hover:scale-105"
//                 />

//                 {/* Minimal Category Badge */}
//                 <div className="absolute top-3 left-3">
//                   <span className="bg-black text-white px-2 py-1 rounded-[3px] text-[7px] sm:text-[9px] font-black uppercase tracking-widest">
//                     {product.category}
//                   </span>
//                 </div>
//               </div>

//               {/* Product Info - Bold Black Look */}
//               <div className="space-y-1.5 px-1">
//                 <h3 className="text-[11px] sm:text-[13px] font-black text-black uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors truncate">
//                   {product.name}
//                 </h3>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-sm sm:text-xl font-black text-black tracking-tighter">
//                       ৳{product.price}
//                     </span>

//                     {product.originalPrice && (
//                       <span className="text-[9px] sm:text-[11px] text-black/30 line-through font-bold">
//                         ৳{product.originalPrice}
//                       </span>
//                     )}
//                   </div>

//                   <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="3"
//                         d="M17 8l4 4m0 0l-4 4m4-4H3"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Optional: View All Button */}
//         <div className="mt-16 text-center">
//           <button
//             onClick={() => navigate("/allproducts")}
//             className="px-8 py-3 border-2 border-black text-black text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-full"
//           >
//             View All Products
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopProducts;





import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecures';


const TopProducts = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    
    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['topProducts'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            // slice(0, 8) নিশ্চিত করবে যেন ঠিক ৮টি কার্ডই প্রদর্শিত হয়
            return res.data.reverse().slice(0, 8);
        }
    });

    if (isLoading) return (
        <div className="h-96 flex justify-center items-center bg-white">
            <span className="loading loading-ring loading-lg text-blue-700"></span>
        </div>
    );

    if (error) return <div className="text-center py-20 text-rose-500 font-black uppercase text-[10px]">Error loading collection</div>;

    return (
        <div className="bg-white py-12 sm:py-20 font-sans uppercase">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="flex flex-col items-center mb-12 sm:mb-16">
                    <h2 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em] mb-3">
                        Just Landed
                    </h2>
                    <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tighter uppercase text-center">
                        Top <span className="text-blue-700">Collection</span>
                    </h2>
                    <div className="h-1.5 w-12 bg-black mt-4"></div>
                </div>

                {/* Products Grid - এখানে Grid ৪টি কলামে থাকবে */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
                    {products.map((product) => (
                        <div 
                            key={product._id} 
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="group cursor-pointer bg-white rounded-[2.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50"
                        >
                            {/* Image Container with NEW Sticker */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-[2rem] p-6 mb-5">
                                
                                {/* NEW Sticker (ব্লু থিম) */}
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="bg-[#1e40af] text-white px-3 py-1.5 rounded-full text-[8px] sm:text-[10px] font-black tracking-tighter shadow-md">
                                        NEW ARRIVALS
                                    </span>
                                </div>

                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2 text-center px-1">
                                <h3 className="text-[11px] sm:text-[12px] font-black text-black tracking-tight leading-tight group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
                                    {product.name}
                                </h3>
                                
                                <div className="flex flex-col items-center gap-1">
                                    {/* Extra Bold Price (আপনার ইমেজের স্টাইলে) */}
                                    <span className="text-xl sm:text-2xl font-[1000] text-black tracking-tighter">
                                        ৳{product.price}
                                    </span>
                                    
                                    {product.originalPrice && (
                                        <span className="text-[10px] sm:text-[12px] text-gray-600 line-through font-bold">
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

                {/* View All Products Button */}
                <div className="mt-16 text-center">
                    <button 
                        onClick={() => navigate('/allproducts')}
                        className="px-10 py-4 border-2 border-black text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all rounded-full"
                    >
                        View All Collection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopProducts;