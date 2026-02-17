import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { CartContext } from "../../../context/AuthContext/CartContext/CartProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecures";
import { useQuery } from "@tanstack/react-query";
import { X, ShoppingBag, Search, Menu, LogOut, ChevronRight, Trash2 } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/allproducts" },
  { name: "Categories", path: "/categories" },
  { name: "Dashboard", path: "/dashboard" },
];

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user, logOut } = useAuth();
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // ১. সার্চের জন্য প্রোডাক্ট ফেচ করা
  const { data: allProducts = [] } = useQuery({
    queryKey: ['allProductsSearch'],
    queryFn: async () => {
      const res = await axiosSecure.get('/products');
      return res.data;
    }
  });

  // ২. লাইভ সার্চ ফিল্টারিং
  const searchResults = searchQuery.trim().length > 0 
    ? allProducts.filter(product => 
        product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const totalAmount = cart?.reduce((total, item) => total + (Number(item.price) * (item.quantity || 1)), 0) || 0;

  return (
    <>
      {/* --- Main Navbar --- */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-[110] shadow-sm py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-2">
            <button onClick={() => setOpenMenu(true)} className="p-2 lg:hidden text-black">
              <Menu size={24} strokeWidth={2.5} />
            </button>
            <NavLink to="/" className="text-xl md:text-2xl font-black tracking-tighter text-black uppercase italic">
              SHOP<span className="text-indigo-600">ZONE.</span>
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.name} to={link.path} className={({ isActive }) => `text-[11px] font-black uppercase tracking-widest transition-colors hover:text-indigo-600 ${isActive ? "text-indigo-600" : "text-slate-500"}`}>
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative flex items-center bg-slate-100 rounded-full px-3 py-1.5">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`bg-transparent text-black text-xs font-bold focus:outline-none transition-all duration-300 ${isSearchOpen ? "w-32 sm:w-48 ml-1 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
              />
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-black hover:text-indigo-600">
                <Search size={18} strokeWidth={2.5} />
              </button>

              {/* Live Search Results */}
              {searchResults.length > 0 && isSearchOpen && (
                <div className="absolute top-full mt-3 right-0 w-72 sm:w-80 bg-white shadow-2xl rounded-2xl border border-slate-50 py-2 z-[130]">
                  {searchResults.map(product => (
                    <div key={product._id} onClick={() => { navigate(`/product/${product._id}`); setSearchQuery(""); setIsSearchOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 transition-colors">
                      <img src={product.image} className="w-10 h-10 object-cover rounded-lg bg-slate-50" alt="" />
                      <div className="flex-1 text-black">
                        <p className="text-[11px] font-black uppercase text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-[10px] font-bold text-indigo-600">৳{product.price}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Bag */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-black transition-transform active:scale-90">
              <ShoppingBag size={24} strokeWidth={2} />
              {cart?.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {user ? (
              <button onClick={() => logOut().then(() => toast.success("Logged out"))} className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            ) : (
              <NavLink to="/login" className="px-5 py-2 bg-black text-white text-[10px] font-black uppercase rounded-full hover:bg-indigo-600 transition-all">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* --- 🛒 CART DRAWER --- */}
      <div className={`fixed inset-0 z-[200] transition-all duration-300 ${isCartOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-80 sm:w-[420px] h-full bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="p-6 flex justify-between items-center border-b border-slate-50">
            <h2 className="text-lg font-black uppercase italic text-black tracking-tighter">Your Bag ({cart?.length || 0})</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-black transition-transform hover:rotate-90"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <ShoppingBag size={60} strokeWidth={1} className="mb-4 opacity-30" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">Bag is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="relative flex gap-4 bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  
                  {/* ডিলিট বাটন: সরাসরি ডাটাবেসের _id ব্যবহার করছে */}
                  <button 
                    onClick={() => removeFromCart(item._id)} 
                    className="absolute -top-1 -right-1 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 h-8 w-8 rounded-full flex items-center justify-center shadow-md z-30 transition-all hover:scale-110"
                    title="Remove item"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>

                  <img src={item.image} className="w-16 h-20 object-cover rounded-xl bg-white border border-slate-100 shadow-sm" alt="" />
                  
                  <div className="flex-1 text-black">
                    <h4 className="text-[11px] font-black uppercase line-clamp-1 pr-4">{item.name}</h4>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 italic uppercase tracking-wider">
                      Qty: {item.quantity || 1}
                    </p>
                    <p className="text-indigo-600 font-black text-sm mt-1">
                      ৳{Number(item.price) * (item.quantity || 1)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 space-y-4 bg-white shadow-inner">
              <div className="flex justify-between items-center font-black uppercase text-black">
                <span className="text-slate-400 text-sm tracking-widest">Total</span>
                <span className="text-2xl font-black tracking-tighter">৳{totalAmount}</span>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }} 
                className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 transition-all shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;