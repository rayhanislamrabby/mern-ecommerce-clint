import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [localCart, setLocalCart] = useState([]);

  // Fetch from DB
  const {
    data: dbCart = [],
    refetch,
    isLoading: isDbLoading,
  } = useQuery({
    queryKey: ["cart", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/carts?email=${user.email}`);
      return res.data;
    },
  });

  // Load Local Storage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setLocalCart(storedCart);
  }, []);

  // FIXED: Logic for 'cart' data
  const cart = useMemo(() => {
    if (user?.email) {
      return dbCart;
    }
    return localCart;
  }, [user?.email, dbCart, localCart]);

  // Combined Loading State
  const cartLoading = authLoading || (!!user?.email && isDbLoading);

  // --- ACTIONS ---

  const { mutate: dbAddToCart } = useMutation({
    mutationFn: async (product) => {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        email: user.email,
        quantity: product.quantity || 1,
      };
      const res = await axiosSecure.post("/carts", cartItem);
      return res.data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Added to database cart");
    },
  });

  const addToCart = (product) => {
    if (user?.email) {
      dbAddToCart(product);
    } else {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const isExist = existingCart.find((item) => item._id === product._id);
      let newCart;
      if (isExist) {
        newCart = existingCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item,
        );
      } else {
        newCart = [
          ...existingCart,
          { ...product, quantity: product.quantity || 1 },
        ];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      setLocalCart(newCart);
      toast.success("Added to local cart");
    }
  };

  const { mutate: dbRemoveFromCart } = useMutation({
    mutationFn: async (id) => {
      const resDel = await axiosSecure.delete(`/carts/${id}`);
      return resDel.data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Removed from cart");
    },
  });

  const removeFromCart = (id) => {
    if (user?.email) {
      dbRemoveFromCart(id);
    } else {
      const updatedCart = localCart.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setLocalCart(updatedCart);
      toast.success("Removed from local storage");
    }
  };

  const clearCart = async () => {
    if (user?.email) {
      await axiosSecure.delete(`/carts/clear?email=${user.email}`);
      refetch();
    } else {
      localStorage.removeItem("cart");
      setLocalCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        refetch,
        isLoading: cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
