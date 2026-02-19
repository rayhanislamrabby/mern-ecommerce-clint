import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  ShoppingBag,
  Search,
  Menu,
  LogOut,
  ChevronDown,
  Trash2,
  User,
} from "lucide-react";

import useAuth from "../../../hooks/useAuth";
import { CartContext } from "../../../context/AuthContext/CartContext/CartProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Collection", path: "/allproducts" },
  {
    name: "Men",
    isDropdown: true,
    submenu: [
      { name: "Panjabi", path: "/category/Panjabi" },
      { name: "Polo Shirt", path: "/category/Polo Shirt" },
      { name: "Casual Shirt", path: "/category/Casual Shirt" },
      { name: "T-Shirt", path: "/category/T-Shirt" },
      { name: "Pant / Denim", path: "/category/Pant" },
      { name: "Blazer", path: "/category/blazer" },
    ],
  },
  {
    name: "Women",
    isDropdown: true,
    submenu: [
      { name: "Kurti", path: "/category/Kurti" },
      { name: "Saree", path: "/category/Saree" },
      { name: "Abaya / Borka", path: "/category/Borka" },
      { name: "Tops", path: "/category/Tops" },
    ],
  },
  {
    name: "Kids",
    isDropdown: true,
    submenu: [
      { name: "Boys", path: "/category/Boys" },
      { name: "Girls", path: "/category/Girls" },
    ],
  },
  {
    name: "Accessories",
    isDropdown: true,
    submenu: [
      { name: "Watches", path: "/category/Watch" },
      { name: "Wallets", path: "/category/Wallet" },
    ],
  },
  { name: "Gift Card", path: "/giftcard" },
  { name: "Dashboard", path: "/dashboard" },
];

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const { user, logOut } = useAuth();
  const { cart = [], removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: allProducts = [] } = useQuery({
    queryKey: ["allProductsSearch"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  const searchResults =
    searchQuery.trim().length > 0
      ? allProducts
          .filter((p) =>
            p?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  const totalAmount =
    cart?.reduce(
      (total, item) => total + Number(item.price) * (item.quantity || 1),
      0,
    ) || 0;

  // FIXED CHECKOUT HANDLER
  const handleCheckout = (e) => {
    if (e) e.preventDefault(); // Click event stop kora

    if (cart.length === 0) {
      toast.error("Bag is empty");
      return;
    }

    setIsCartOpen(false);

    setTimeout(() => {
      navigate("/checkout", { replace: true });
    }, 150);
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-[100] shadow-sm py-1 font-sans">
        <div className="max-w-7xl mx-auto px-3 h-16 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOpenMenu(true)}
              className="lg:hidden text-black p-1"
            >
              <Menu size={26} />
            </button>
            <NavLink
              to="/"
              className="text-xl md:text-2xl font-black pr-6 tracking-tighter text-black uppercase italic"
            >
              SHOP<span className="text-blue-700 sm:inline hidden">ZONE.</span>
              <span className="text-blue-700 inline sm:hidden">ZONE.</span>
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <div
                key={link.name}
                className="relative h-16 flex items-center cursor-pointer"
                onMouseEnter={() => setHoveredMenu(link.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                {link.isDropdown ? (
                  <span
                    className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${hoveredMenu === link.name ? "text-blue-700" : "text-slate-700"}`}
                  >
                    {link.name} <ChevronDown size={12} />
                  </span>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-[12px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-blue-700" : "text-slate-700 hover:text-blue-700"}`
                    }
                  >
                    {link.name}
                  </NavLink>
                )}

                {link.submenu && hoveredMenu === link.name && (
                  <div className="absolute top-[60px] left-0 w-52 bg-white shadow-2xl border border-slate-50 py-4 rounded-b-2xl z-[150] animate-in fade-in slide-in-from-top-1">
                    {link.submenu.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className="block px-6 py-2.5 text-[12px] font-black uppercase text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 border-l-4 border-transparent hover:border-blue-700 transition-all"
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3">
            <div className="relative flex-1 max-w-[100px] sm:max-w-[220px] md:max-w-[260px] flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-700 transition-all">
              <Search size={14} className="text-slate-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-[11px] font-bold text-black outline-none ml-2 w-full"
              />

              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 w-[260px] sm:w-80 bg-white shadow-2xl rounded-2xl mt-3 border border-slate-100 overflow-hidden z-[200]">
                  {searchResults.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        navigate(`/product/${p._id}`);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 transition-colors"
                    >
                      <img
                        src={p.image}
                        className="w-10 h-10 object-cover rounded-lg"
                        alt=""
                      />
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-black line-clamp-1">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-blue-700 font-black">
                          ৳{p.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-black hover:bg-slate-50 rounded-full transition-all active:scale-90"
            >
              <ShoppingBag size={24} />
              {cart?.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-blue-700 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={() => logOut()}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors flex items-center justify-center"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase rounded-full hover:bg-blue-700 transition-all shadow-sm"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[500] lg:hidden ${openMenu ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${openMenu ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpenMenu(false)}
        ></div>
        <div
          className={`absolute top-0 left-0 w-[85%] max-w-[320px] h-full bg-white transition-transform duration-500 shadow-2xl ${openMenu ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 flex justify-between items-center border-b">
            <span className="text-xl text-black font-black italic">
              SHOP<span className="text-blue-700">ZONE.</span>
            </span>
            <button
              onClick={() => setOpenMenu(false)}
              className="p-2 text-black rounded-full transition-colors"
            >
              <X size={28} />
            </button>
          </div>
          <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
            {NAV_LINKS.map((link) => (
              <div
                key={link.name}
                className="border-b border-slate-50 last:border-0"
              >
                <div
                  className="flex justify-between items-center py-4 cursor-pointer group"
                  onClick={() =>
                    link.isDropdown
                      ? setActiveMobileSubmenu(
                          activeMobileSubmenu === link.name ? null : link.name,
                        )
                      : (setOpenMenu(false), navigate(link.path))
                  }
                >
                  <span
                    className={`text-[13px] font-black uppercase tracking-widest transition-colors ${activeMobileSubmenu === link.name ? "text-blue-700" : "text-slate-800 group-hover:text-blue-700"}`}
                  >
                    {link.name}
                  </span>
                  {link.isDropdown && (
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${activeMobileSubmenu === link.name ? "rotate-180 text-blue-700" : "text-slate-600"}`}
                    />
                  )}
                </div>
                {link.isDropdown && activeMobileSubmenu === link.name && (
                  <div className="ml-4 mb-4 flex flex-col gap-3 border-l-2 border-blue-700 pl-4 animate-in slide-in-from-top-2">
                    {link.submenu.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        onClick={() => setOpenMenu(false)}
                        className="text-[11px] font-bold text-slate-800 uppercase py-1 hover:text-blue-700 transition-colors"
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      <div
        className={`fixed inset-0 z-[500] ${isCartOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsCartOpen(false)}
        ></div>
        <div
          className={`absolute top-0 right-0 w-full max-w-[380px] h-full bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 flex justify-between items-center border-b font-black uppercase italic">
            <span className="text-black flex items-center gap-2 tracking-tight">
              <ShoppingBag size={20} className="text-blue-700" /> My Bag (
              {cart.length})
            </span>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-black rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                <ShoppingBag size={50} strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Empty Bag
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="relative flex gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-400"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item._id);
                    }}
                    className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <img
                    src={item.image}
                    className="w-16 h-20 object-cover rounded-xl"
                    alt=""
                  />
                  <div className="flex-1 text-[11px] font-black uppercase flex flex-col justify-center">
                    <h4 className="line-clamp-1 pr-6 text-black tracking-tighter">
                      {item.name}
                    </h4>
                    <p className="text-blue-700 mt-1 text-sm font-black">
                      ৳{item.price}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1 font-bold">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-white">
              <div className="flex justify-between items-center mb-5 font-black uppercase tracking-tighter">
                <span className="text-xs text-slate-500">Subtotal</span>
                <span className="text-xl text-blue-700 italic">
                  ৳{totalAmount}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-700 transition-all shadow-lg active:scale-95"
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
