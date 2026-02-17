import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { Home } from "lucide-react";

import errorAnimation from "../../assets/Not Found 404.json"; 

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="text-center max-w-lg w-full">
        
        {/* Lottie Animation - Now using local file */}
        <div >
          <Lottie 
            animationData={errorAnimation} 
            loop={true} 
          />
        </div>

        <div className="relative z-10">
        
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all duration-300 shadow-2xl shadow-indigo-100 active:scale-95 group"
          >
            <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;