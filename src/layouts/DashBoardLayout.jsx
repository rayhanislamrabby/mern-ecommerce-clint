import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  LayoutDashboard,
  PlusSquare,
  Home,
  Menu,
  LogOut,
  Layers,
  ChevronRight,
  TicketPlus,
  Tickets,
  UserCog,
  CheckCircle,
  PackageSearch,
  CircleDollarSign,
} from "lucide-react";
import useAuth from "../hooks/useAuth";


const DashboardLayout = () => {
  const { user, logOut } = useAuth();

  const menuLinks = [
  
    {
      name: "Paid Orders",
      path: "/dashboard/paidoders",
      icon: (
        <CheckCircle size={20} strokeWidth={2.5} className="text-emerald-500" />
      ),
    },
    {
      name: "Unpaid Orders",
      path: "/dashboard/unpaidorders",

      icon: (
        <CircleDollarSign
          size={20}
          strokeWidth={2.5}
          className="text-orange-500"
        />
      ),
    },

    {
      name: "Add Products",
      path: "/dashboard/addproducts",
      icon: (
        <PlusSquare size={20} strokeWidth={2.5} className="text-blue-500" />
      ),
    },

    {
      name: "Manage Products",
      path: "/dashboard/adminproducts",
      icon: (
        <PackageSearch
          size={20}
          strokeWidth={2.5}
          className="text-indigo-500"
        />
      ),
    },
    {
      name: "Add Coupon",
      path: "/dashboard/addcoupon",
      icon: <TicketPlus size={20} className="text-cyan-400" />,
    },

    {
      name: "Manage Coupons",
      path: "/dashboard/managecoupons",
      icon: <Tickets size={20} className="text-cyan-400" />,
    },

    {
      name: "Make As Admin",
      path: "/dashboard/makeasdadmin",
      icon: <UserCog size={20} className="text-cyan-400" />,
    },
  ];

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "AD";
  };

  return (
    <div className="drawer lg:drawer-open bg-[#1e4061] font-sans">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* --- Main Content Area --- */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Top Navbar - Simplified & Elegant */}
        <header className="navbar bg-white/90 backdrop-blur-md border-b border-slate-300 px-6 md:px-12 sticky top-0 z-30 h-20">
          <div className="flex-1">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-ghost lg:hidden hover:text-emerald-500 text-slate-900 mr-4"
            >
              <Menu size={24} />
            </label>
            <h2 className="hidden md:block text-xl font-[1000] text-black tracking-tighter ">
              Admin{" "}
              <span className="text-blue-700 opacity-60">/ Management</span>
            </h2>
          </div>

          <div className="flex items-center">
            {/* User Profile Section - Prominent & Deep Color */}
            <div className="flex items-center gap-4 pl-6 border-l-2 border-slate-200">
              <div className="text-right hidden sm:block leading-tight">
                <h4 className="text-sm font-[1000] text-slate-900 tracking-tight">
                  {user?.displayName || "Admin User"}
                </h4>
                <p className="text-[11px] text-slate-600 font-bold lowercase italic tracking-wide">
                  {user?.email?.toLowerCase() || "admin@shopzone.com"}
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-2xl border-2 border-white ring-4 ring-indigo-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(user?.displayName)
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-12 transition-all">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- Deep Aesthetic Sidebar --- */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        {/* Updated Gradient with Deeper Tones */}
        <div className="w-80 min-h-full bg-gradient-to-b from-[#11416b] via-[#c6dfff] to-[#052341] border-r border-slate-300 flex flex-col shadow-2xl">
          {/* Logo Section */}
          <div className="p-10 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 rotate-3 hover:rotate-0 transition-all duration-500">
                <Layers className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-[1000] tracking-tighter text-slate-900 uppercase italic">
                SHOP<span className="text-white"> ZONE.</span>
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 opacity-90">
                Main Menu
              </p>
              <ul className="space-y-2">
                {menuLinks.map((link, index) => (
                  <li key={index}>
                    <NavLink
                      to={link.path}
                      end={link.path === "/dashboard"}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group ${
                          isActive
                            ? "bg-white text-[#3b49df] shadow-2xl shadow-blue-300/50 scale-[1.05] border-r-[6px] border-[#3b49df]"
                            : "text-slate-900 hover:text-[#3b49df] hover:bg-white/50"
                        }`
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="transition-transform duration-300 group-hover:scale-110">
                          {link.icon}
                        </span>
                        <span className="text-[12px] font-[1000] uppercase tracking-widest italic">
                          #{link.name.replace(/\s+/g, "")}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                      />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Sidebar Footer */}

          <div className="p-8 mt-auto border-t border-slate-300 bg-white/10 backdrop-blur-sm">
            <NavLink
              to="/"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 mt-3 mb-4 rounded-2xl text-slate-900 hover:text-black bg-blue-600 hover:bg-red-400 transition-all duration-500 font-black text-[11px] uppercase tracking-widest shadow-lg border border-slate-200"
            >
              <Home size={12} /> Exit Dashboard
            </NavLink>

            <button
              onClick={() => logOut()}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-slate-900  bg-rose-500 hover:text-white transition-all duration-500 font-black text-[11px] uppercase tracking-widest shadow-lg border border-slate-200"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
