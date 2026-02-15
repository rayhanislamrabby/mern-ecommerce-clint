import React from "react";
import useAuth from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";

const SocalLogin = () => {
  const { signInWidthGoogle } = useAuth();
  const handelGoogleSignIn = () => {
    signInWidthGoogle()
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <button
        onClick={handelGoogleSignIn}
        className="w-full border border-gray-300 py-3 rounded-lg
          flex items-center justify-center gap-2 hover:bg-gray-50 transition"
      >
        <FcGoogle size={22} />
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>
    </div>
  );
};

export default SocalLogin;
