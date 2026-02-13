import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = {
  home: { name: "Home", path: "/" },
  shop: { name: "Shop", path: "/shop" },
  categories: { name: "Categories", path: "/categories" },
  deals: { name: "Deals", path: "/deals" },
  contact: { name: "Contact", path: "/contact" },
};

const Navbar = () => {
  const links = Object.values(NAV_LINKS);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
        {/* Left */}
        <div className="navbar-start gap-2">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpenMenu(true)}
            className="btn btn-ghost lg:hidden"
          >
            ☰
          </button>

          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold text-primary">
            ShopZone
          </NavLink>

          {/* Mobile search beside logo */}
          <div className="md:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered input-sm w-28"
            />
          </div>
        </div>

        {/* Center - Desktop menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? "text-primary font-semibold" : ""
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <div className="navbar-end gap-2">
          {/* Desktop search */}
          <div className="form-control hidden md:block">
            <input
              type="text"
              placeholder="Search products"
              className="input input-bordered w-40 md:w-56"
            />
          </div>

          {/* Wishlist */}
          <button className="btn btn-ghost btn-circle">❤</button>

          {/* Cart */}
          <button className="btn btn-ghost btn-circle">🛒</button>
        </div>
      </nav>

      {/* ===== MOBILE FULL MENU ===== */}
      {openMenu && (
        <div className="fixed inset-0 bg-base-100 z-50 p-6 overflow-y-auto">
          <button className="mb-4 text-xl" onClick={() => setOpenMenu(false)}>
            ✕
          </button>

        
          <ul className="space-y-4 text-lg">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink to={link.path} onClick={() => setOpenMenu(false)}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;