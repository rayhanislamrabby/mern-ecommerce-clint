import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  ShoppingBag,
  Users,
  Settings,
  Home,
  Menu,
  ChevronRight
} from "lucide-react";

const DashboardLayout = () => {
  const menuLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Add Products",
      path: "/dashboard/addproducts",
      icon: <PlusSquare size={18} />,
    },
    {
      name: "Manage Products",
      path: "/dashboard/manage-products",
      icon: <ShoppingBag size={18} />,
    },
    { name: "Users", path: "/dashboard/users", icon: <Users size={18} /> },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <div className="drawer lg:drawer-open bg-[#F8FAFC]">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col min-h-screen">
        
        {/* Top Navbar for Mobile & Tablet */}
        <div className="navbar bg-white border-b border-gray-100 lg:hidden px-6 sticky top-0 z-30 h-20">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-ghost btn-square text-black"
            >
              <Menu size={24} />
            </label>
          </div>
          <div className="flex-1 ml-4">
            <span className="text-xl font-black text-black tracking-tighter">ADMIN PANEL</span>
          </div>
        </div>

        {/* Dynamic Content Rendering */}
        <main className="p-4 md:p-10 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <Outlet />
            </div>
        </main>
      </div>

      {/* Sidebar Section */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <div className="w-80 min-h-full bg-white text-black border-r border-gray-100 flex flex-col">
          
          {/* Brand Identity */}
          <div className="p-10">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-black p-2.5 rounded-2xl group-hover:bg-[#1e40af] transition-all duration-300">
                <ShoppingBag className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter leading-none text-black">
                  E-SHOP
                </h1>
                <p className="text-[9px] font-black text-[#1e40af] uppercase tracking-[0.3em] mt-1">
                  Control Center
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-6 space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-4">Main Menu</p>
            <ul className="space-y-1.5">
              {menuLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    end={link.path === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 font-bold group ${
                        isActive
                          ? "bg-[#1e40af] text-white shadow-xl shadow-blue-100"
                          : "text-gray-500 hover:bg-gray-50 hover:text-black"
                      }`
                    }
                  >
                    <div className="flex items-center gap-4">
                        <span className="transition-transform group-hover:scale-110">
                            {link.icon}
                        </span>
                        <span className="text-[13px] uppercase tracking-wide">{link.name}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Navigation */}
          <div className="p-8 border-t border-gray-50">
            <NavLink
              to="/"
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 bg-red-50/50 hover:bg-red-500 hover:text-white transition-all duration-300 font-black text-[12px] uppercase tracking-widest"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;