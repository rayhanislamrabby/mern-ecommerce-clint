// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import useAuth from "../../../hooks/useAuth";

// const NAV_LINKS = {
//   home: { name: "Home", path: "/" },
//   shop: { name: "Shop", path: "/shop" },
//   categories: { name: "Categories", path: "/categories" },
//   deals: { name: "Deals", path: "/deals" },
//   contact: { name: "Contact", path: "/contact" },
// };

// const Navbar = () => {
//   const links = Object.values(NAV_LINKS);
//   const [openMenu, setOpenMenu] = useState(false);
// const {user, logOut} = useAuth()
//   const user = null; // future auth

//   return (
//     <>
//       {/* ===== NAVBAR ===== */}
//       <nav className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
//         {/* Left */}
//         <div className="navbar-start gap-2">
//           {/* Mobile menu button */}
//           <button
//             onClick={() => setOpenMenu(true)}
//             className="btn btn-ghost lg:hidden"
//           >
//             ☰
//           </button>

//           {/* Logo */}
//           <NavLink to="/" className="text-xl font-bold text-primary">
//             ShopZone
//           </NavLink>
//         </div>

//         {/* Center - Desktop menu */}
//         <div className="navbar-center hidden lg:flex">
//           <ul className="menu menu-horizontal px-1 font-medium">
//             {links.map((link) => (
//               <li key={link.name}>
//                 <NavLink
//                   to={link.path}
//                   className={({ isActive }) =>
//                     isActive ? "text-primary font-semibold" : ""
//                   }
//                 >
//                   {link.name}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right */}
//         <div className="navbar-end gap-2">
//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search"
//             className="input input-bordered w-28 sm:w-40 md:w-56"
//           />

//           {/* Wishlist */}
//           <button className="btn btn-ghost btn-circle">❤</button>

//           {/* Cart */}
//           <button className="btn btn-ghost btn-circle">🛒</button>

//           {/* Login → Desktop only */}
//           {!user && (
//             <NavLink
//               to="/login"
//               className="btn btn-primary btn-sm hidden lg:inline-flex"
//             >
//               Login
//             </NavLink>
//           )}
//         </div>
//       </nav>

//       {/* ===== MOBILE FULL MENU ===== */}
//       {openMenu && (
//         <div className="fixed inset-0 bg-base-100 z-50 p-6 overflow-y-auto">
//           <button className="mb-4 text-xl" onClick={() => setOpenMenu(false)}>
//             ✕
//           </button>

//           Links
//           <ul className="space-y-4 text-lg">
//             {links.map((link) => (
//               <li key={link.name}>
//                 <NavLink to={link.path} onClick={() => setOpenMenu(false)}>
//                   {link.name}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>

//           {/* Mobile Login bottom */}
//           {!user && (
//             <div className="mt-8">
//               <NavLink
//                 to="/login"
//                 onClick={() => setOpenMenu(false)}
//                 className="btn btn-primary w-full"
//               >
//                 Login
//               </NavLink>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

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

  // 🔐 Auth state
  const { user, logOut } = useAuth();

  // const handleLogout = () => {
  //   logOut().catch(console.error);
  // };

  const navigate = useNavigate();

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("You’ve been safely logged out. See you again!", {
          duration: 2000,
        });

        setTimeout(() => {
          navigate("/login");
        }, 800);
      })
      .catch(() => {
        toast.error("Logout failed. Try again.");
      });
  };

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
          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-28 sm:w-40 md:w-56"
          />

          {/* Wishlist */}
          <button className="btn btn-ghost btn-circle">❤</button>

          {/* Cart */}
          <button className="btn btn-ghost btn-circle">🛒</button>

          {/* User name (desktop) */}
          {user && (
            <span className="hidden lg:block text-xs  text-blue-400">
              {user.displayName || user.email}
            </span>
          )}

          {/* Auth button (desktop) */}
          {user ? (
            <button
              onClick={handleLogout}
              className="btn btn-error btn-sm hidden lg:inline-flex"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="btn btn-primary btn-sm hidden lg:inline-flex"
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>

      {/* ===== MOBILE FULL MENU ===== */}
      {openMenu && (
        <div className="fixed inset-0 bg-base-100 z-50 p-6 overflow-y-auto">
          <button className="mb-4 text-xl" onClick={() => setOpenMenu(false)}>
            ✕
          </button>

          {/* Links */}
          <ul className="space-y-4 text-lg">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink to={link.path} onClick={() => setOpenMenu(false)}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile user info */}
          {user && (
            <p className="mt-6 font-medium text-gray-700">
              {user.displayName || user.email}
            </p>
          )}

          {/* Mobile Auth button */}
          <div className="mt-4">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setOpenMenu(false);
                }}
                className="btn btn-error w-full"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpenMenu(false)}
                className="btn btn-primary w-full"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
