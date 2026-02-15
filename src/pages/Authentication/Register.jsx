import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { NavLink } from "react-router";


const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const subscription = watch((value) => setPassword(value.password));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => {
    console.log("Register Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account ✨
        </h2>
        <p className="text-center text-gray-500 mt-1 mb-6">
          Sign up to start shopping
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
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
              placeholder="Create password"
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
          </div>

          {/* Confirm */}
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("confirmPassword", {
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg
            font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          className="w-full border border-gray-300 py-3 rounded-lg
          flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
