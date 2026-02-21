import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import SocalLogin from "./SocalLogin";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    signIn(data.email.trim(), data.password.trim())
      .then(() => {
        toast.success("Welcome Back!", {
          style: {
            background: "#000",
            color: "#fff",
            fontWeight: "900",
            borderRadius: "0px",
          },
        });
        setTimeout(() => navigate(from, { replace: true }), 1000);
      })
      .catch(() => {
        toast.error("Invalid credentials. Try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[450px] bg-white border border-gray-100 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem]"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
          >
            Secure Login
          </motion.div>
          <h2 className="text-4xl font-[1000] text-black uppercase tracking-tighter italic">
            Shop<span className="text-indigo-600">Zone.</span>
          </h2>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">
            Enter your credentials below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-black focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Password
              </label>
              <Link
                to="/forgot"
                className="text-[10px] font-black uppercase text-indigo-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-black focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                {...register("password", { required: "Password is required" })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-all duration-300 mt-4"
          >
            Sign In Now
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-gray-100" />
          <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">
            OR
          </span>
          <div className="flex-1 h-[1px] bg-gray-100" />
        </div>

        {/* Social Login Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SocalLogin />
        </motion.div>

        {/* Footer Link */}
        <p className="text-center text-[11px] font-bold text-gray-400 mt-8 uppercase tracking-widest">
          New here?
          <NavLink
            to="/register"
            className="text-indigo-600 font-[1000] ml-2 hover:underline tracking-tighter"
          >
            Create Account
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
