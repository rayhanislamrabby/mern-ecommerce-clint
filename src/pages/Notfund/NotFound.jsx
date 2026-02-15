import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full"
      >
        {/* 404 Number */}
        <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg
          font-semibold hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
