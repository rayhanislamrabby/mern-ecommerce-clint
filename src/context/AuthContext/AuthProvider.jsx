

import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContex";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.innit";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Register
  const creatUser = async (email, password, name) => {
    setLoading(true);

    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, {
      displayName: name,
    });

    setLoading(false);
    return result;
  };

  // 🔐 Login
  const signIn = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
    return result;
  };

// Googlr Login 
const signInWidthGoogle = () => {



setLoading(true);

return signInWithPopup(auth, googleProvider)

}





  // 🔓 Logout
  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  // 🔄 Auth state observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("user in auth state change:", currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const authInfo = { user, loading, creatUser, signIn, logOut,signInWidthGoogle};

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
