import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecures';

const HomeSlider = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [imageIndex, setImageIndex] = useState(0);

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['category-cards-data'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            return res.data;
        }
    });

    // 1. Grouping Logic: trim() ebong lowerCase() use kora hoyeche safety-r jonno
    const groupedProducts = {
        "Polo Shirt": products.filter(p => p.category?.toLowerCase().trim() === "polo shirt"),
        "Panjabi": products.filter(p => p.category?.toLowerCase().trim() === "panjabi"),
        "Casual Shirt": products.filter(p => p.category?.toLowerCase().trim() === "casual shirt")
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prev) => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 2. Categories mapping array: ekhane 'name' ta database-er category name-er sathe milte hobe
    const categories = [
        { title: "Polo Shirts", name: "Polo Shirt" }, 
        { title: "Panjabis", name: "Panjabi" },
        { title: "Casual Shirts", name: "Casual Shirt" }
    ];

    if (isLoading) return <div className="h-64 flex items-center justify-center font-black text-zinc-300 tracking-[.5em] uppercase text-[10px]">Syncing Collections...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => {
                    // 3. Logic: Grouped object theke specific list ta ber kora
                    const categoryItems = groupedProducts[cat.name] || [];
                    
                    // 4. Image rotate logic
                    const currentImg = categoryItems.length > 0 
                        ? categoryItems[imageIndex % categoryItems.length].image 
                        : "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800";

                    return (
                        <div 
                            key={cat.name}
                            onClick={() => navigate(`/category/${cat.name}`)}
                            className="group relative cursor-pointer overflow-hidden aspect-[3/4.5] bg-zinc-100 rounded-sm"
                        >
                            <img 
                                key={currentImg} // image change hole animation trigger hobe
                                src={currentImg} 
                                alt={cat.title}
                                className="w-full h-full object-cover transition-all duration-[2000ms] ease-in-out group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80" />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                                <span className="text-[10px] font-black tracking-[0.4em] mb-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 uppercase">
                                    Shop Now
                                </span>
                                <h2 className="text-3xl md:text-5xl font-[1000] italic tracking-tighter drop-shadow-2xl uppercase leading-none">
                                    {cat.title}
                                </h2>
                                <div className="h-1 w-0 group-hover:w-16 bg-white mt-4 transition-all duration-500"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HomeSlider;