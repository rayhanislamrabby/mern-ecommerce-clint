import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaGithub,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import paymentImg from "../../../assets/payment.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-10 pb-6 font-sans border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* 1. Brand & About */}
        <div className="space-y-4">
          <h2 className="text-xl font-[1000] tracking-tighter italic uppercase">
            Shop<span className="text-indigo-500">Zone.</span>
          </h2>
          <p className="text-zinc-400 text-[10px] font-bold leading-relaxed tracking-wide uppercase max-w-xs">
            Elevate your lifestyle with our premium collection. Quality, style,
            and comfort right to your doorstep.
          </p>
          <div className="flex gap-3">
            {[
              { Icon: FaYoutube, link: "#" },
              { Icon: FaInstagram, link: "" },
              {
                Icon: FaFacebookF,
                link: "https://facebook.com/abirahmedrabbyyy",
              },

              {
                Icon: FaGithub,
                link: "https://github.com/rayhanislamrabby/mern-ecommerce-clint",
              },
            ].map((social, i) => (
              <NavLink
                key={i}
                to={social.link}
                className="w-10 h-10 rounded-full bg-zinc-900 text-zinc-400 flex items-center justify-center hover:bg-white hover:text-black transition-all border border-zinc-800 shadow-lg"
              >
                <social.Icon size={18} />
              </NavLink>
            ))}
          </div>
        </div>

        {/* 2. Quick Navigation */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase border-l-2 border-indigo-600 pl-3">
            Navigation
          </h3>
          <ul className="space-y-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            <li>
              <NavLink to="/" className="hover:text-white transition-colors">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/allproducts"
                className="hover:text-white transition-colors"
              >
                Collection
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categories"
                className="hover:text-white transition-colors"
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 3. Shop Categories */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase border-l-2 border-indigo-600 pl-3">
            Top Categories
          </h3>
          <ul className="space-y-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            <li>
              <NavLink
                to="/category/Panjabi"
                className="hover:text-white transition-colors"
              >
                Panjabi
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category/Watch"
                className="hover:text-white transition-colors"
              >
                Watches
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category/Perfume"
                className="hover:text-white transition-colors"
              >
                Fragrances
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category/Polo"
                className="hover:text-white transition-colors"
              >
                Polo Shirt
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 4. Contact Info */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase border-l-2 border-indigo-600 pl-3">
            Get In Touch
          </h3>
          <ul className="space-y-3 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-indigo-500 mt-0.5" size={12} />
              <span className="leading-tight text-zinc-300">
                Sector-10, Uttara, Dhaka
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-indigo-500" size={12} />
              <span className="text-zinc-300">+880 1XXX-XXXXXX</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-indigo-500" size={12} />
              <span className="lowercase text-zinc-300">
                support@shopzone.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Payment Methods --- */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-zinc-900">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[8px] font-black tracking-[0.3em] text-zinc-500 uppercase italic">
            Authorized Payment Gateways
          </span>
          <div className="w-full flex justify-center">
            <img
              src={paymentImg}
              alt="Payment Methods"
              className="max-w-3xl w-full h-auto object-contain transition-all duration-700"
            />
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-900 pt-6">
        <p className="text-[11px] font-black tracking-[0.1em] text-zinc-400 uppercase">
          © {currentYear} ShopZone. All Rights Reserved. <br /> | Made with ❤️
          By
          <NavLink
            to="https://www.facebook.com/abirahmedrabbyyy"
            className="text-indigo-500 hover:text-white ml-1 transition-colors"
          >
            RABBY
          </NavLink>
        </p>

        <div className="flex gap-6 text-[11px] font-black tracking-widest text-zinc-400 uppercase">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Refund
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
