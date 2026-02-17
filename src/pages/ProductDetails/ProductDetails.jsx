import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecures';
import { Minus, Plus, ChevronRight, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { CartContext } from '../../context/AuthContext/CartContext/CartProvider';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { addToCart } = useContext(CartContext);
    
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/products/${id}`);
            return res.data;
        }
    });

    const { data: relatedProducts = [] } = useQuery({
        queryKey: ['relatedProducts', product?.category],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            return res.data.filter(item => item.category === product?.category && item._id !== id);
        },
        enabled: !!product?.category
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        setQuantity(1);
        setSelectedSize(null);
    }, [id]);

    const handleAction = (isBuyNow = false) => {
        if (!selectedSize) {
            Swal.fire({ icon: 'error', title: 'Select Size', text: 'Please choose a size first!', confirmButtonColor: '#000' });
            return;
        }
        const cartItem = { ...product, _id: `${product._id}-${selectedSize}`, originalId: product._id, size: selectedSize, quantity: quantity };
        addToCart(cartItem);
        if (isBuyNow) navigate('/checkout');
        else Swal.fire({ position: 'top-end', icon: 'success', title: 'Added to cart', showConfirmButton: false, timer: 1500, toast: true });
    };

    if (isProductLoading) return <div className="h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-black"></span></div>;

    return (
        <div className="bg-white min-h-screen text-black pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Image */}
                    <div className="flex-1">
                        <div className="sticky top-24 bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden cursor-zoom-in">
                            <div className="relative overflow-hidden aspect-square" onClick={() => setIsZoomed(!isZoomed)}>
                                <img 
                                    src={product.image} 
                                    className={`w-full h-full object-contain p-8 transition-transform duration-500 ${isZoomed ? 'scale-[1.8] cursor-zoom-out' : 'scale-100'}`} 
                                    alt={product.name} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 space-y-6">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">{product.name}</h1>
                        <p className="text-xs font-black text-black tracking-[0.3em] opacity-90">SKU: {product.sku} | {product.category}</p>
                        
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-black text-black">৳{product.price}</span>
                            {product.originalPrice && <span className="text-xl text-zinc-300 line-through italic">৳{product.originalPrice}</span>}
                        </div>

                        <p className="text-sm text-black font-medium leading-relaxed">{product.description}</p>

                        {/* Size Selector */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-widest text-black">Select Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes?.map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 border-2 text-[10px] font-black transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-black hover:text-white'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Measurement Table */}
                        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 overflow-x-auto">
                            <h3 className="text-[10px] font-black uppercase mb-4 text-center tracking-widest text-black underline underline-offset-4">Measurement Guide (Inch)</h3>
                            <table className="w-full text-[11px] font-black text-center text-black">
                                <thead>
                                    <tr className="border-b border-zinc-300">
                                        <th className="pb-2 text-left">Size</th>
                                        {Object.keys(product.sizeChart[product.sizes[0]]).map(k => <th key={k} className="pb-2 uppercase">{k}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(product.sizeChart).map(([size, m]) => (
                                        <tr key={size} className={`border-b border-zinc-200 ${selectedSize === size ? 'bg-black text-white' : ''}`}>
                                            <td className="py-2 text-left">{size}</td>
                                            {Object.values(m).map((v, i) => <td key={i} className="py-2">{v}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="pt-6 space-y-4">
                            <div className="flex items-center border-2 border-black w-fit h-14 bg-white">
                                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-5 hover:bg-black hover:text-white transition-colors h-full"><Minus size={14}/></button>
                                <span className="px-8 font-black text-lg text-black">{quantity}</span>
                                <button onClick={() => setQuantity(q => q+1)} className="px-5 hover:bg-black hover:text-white transition-colors h-full"><Plus size={14}/></button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => handleAction(false)} className="flex-1 bg-white border-2 border-black text-black font-black uppercase tracking-widest py-4 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Add To Cart</button>
                                <button onClick={() => handleAction(true)} className="flex-1 bg-black border-2 border-black text-white font-black uppercase tracking-widest py-4 hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-24 border-t-2 border-black pt-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-black">You May Also Like</h2>
                        <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600">View All <ArrowRight size={14} /></button>
                    </div>

                    {relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {relatedProducts.slice(0, 4).map((item) => (
                                <div key={item._id} onClick={() => navigate(`/product/${item._id}`)} className="group cursor-pointer">
                                    <div className="aspect-[3/4] bg-zinc-50 rounded-2xl overflow-hidden mb-4 relative border border-zinc-200 group-hover:border-black transition-all">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-black mb-1 opacity-70">{item.category}</h3>
                                    <p className="font-black text-sm truncate uppercase text-black">{item.name}</p>
                                    <p className="text-sm font-black mt-1 text-black">৳{item.price}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-black font-black italic text-center py-10">SEARCHING FOR SIMILAR VIBES...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
