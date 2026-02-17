import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Link, NavLink } from "react-router-dom";
import SocalLogin from "./SocalLogin";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

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

  useEffect(() => {
    // Test toast message to verify setup
    
  }, []);

  const onSubmit = (data) => {
    signIn(data.email.trim(), data.password.trim())
      .then((result) => {
        console.log(result.user);

        // ✅ success toast
        // toast.success("Login successful 🎉");
        toast.success("Login successful", {
  duration: 2000,
  style: {
    background: "#16a34a",
    color: "#fff",
    fontWeight: "500",
  },
});


      
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      })
      .catch((error) => {
        console.log(error.message);

  
        toast.error("Invalid email or password");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mt-1 mb-6">
          Login to continue shopping
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot */}
          <div className="text-right">
            <Link
              to="/auth/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg
            font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <SocalLogin></SocalLogin>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?
          <NavLink
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
