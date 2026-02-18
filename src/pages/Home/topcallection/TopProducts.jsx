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
            
         
            const sortedData = res.data.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );

         
            return sortedData.slice(0, 8); 
        },
        
        staleTime: 1000 * 60 * 5, 
        refetchOnWindowFocus: false, 
    });

    if (isLoading) return (
        <div className="h-96 flex justify-center items-center bg-white">
            <span className="loading loading-ring loading-lg text-blue-700"></span>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 text-rose-500 font-black uppercase text-[10px]">
            Error loading collection
        </div>
    );

    return (
        <div className="bg-white py-10 sm:py-10 font-sans uppercase">
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

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
                    {products.map((product) => (
                        <div 
                            key={product._id} 
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="group cursor-pointer bg-white rounded-[2.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-[2rem] p-6 mb-5">
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="bg-[#1e40af] text-white px-3 py-1.5 rounded-full text-[8px] sm:text-[10px] font-black tracking-tighter shadow-md">
                                        NEW ARRIVAL
                                    </span>
                                </div>

                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

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

               



            </div>
        </div>
    );
};

export default TopProducts;