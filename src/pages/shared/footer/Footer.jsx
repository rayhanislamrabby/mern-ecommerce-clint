import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";

const NAV_LINKS = {
  home: { name: "Home", path: "/" },
  shop: { name: "Shop", path: "/shop" },
  categories: { name: "Categories", path: "/categories" },
  deals: { name: "Deals", path: "/deals" },
  contact: { name: "Contact", path: "/contact" },
};

/**
 * Standalone Footer Component
 * Only footer — no navbar included
 */
const Footer = () => {
  return (
    <footer className="bg-primary text-primary-content">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3 items-center">
        {/* Brand */}
        <aside className="space-y-3 text-center md:text-left">
          <h2 className="text-xl font-bold">ShopZone</h2>
          <p className="text-sm opacity-80">
            Premium fashion & lifestyle products you can trust.
          </p>
          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} — All rights reserved
          </p>
        </aside>

        {/* Quick Links */}
        <nav className="text-center">
          <h3 className="footer-title mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {Object.values(NAV_LINKS).map((link) => (
              <li key={link.name}>
                <NavLink to={link.path} className="hover:underline">
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Icons */}
        <nav className="text-center md:text-right">
          <h3 className="footer-title mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-end gap-4 text-lg">
            {[FaFacebookF, FaYoutube, FaTwitter].map((Icon, i) => (
              <a
                key={i}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
              >
                <Icon />
              </a>
            ))}
          </div>
        </nav>
      </div>

   
    </footer>
  );
};

export default Footer;