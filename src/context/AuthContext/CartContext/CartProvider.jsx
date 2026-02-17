import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";

import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecures";
import useAuth from "../../../hooks/useAuth";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();


    const { data: cart = [], refetch } = useQuery({
        queryKey: ['cart', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?email=${user.email}`);
            return res.data;
        }
    });


    const { mutate: addToCart } = useMutation({
        mutationFn: async (product) => {
            const cartItem = {
                productId: product._id, 
                name: product.name,
                price: product.price,
                image: product.image,
                email: user.email,
                quantity: 1
            };
            const res = await axiosSecure.post('/carts', cartItem);
            return res.data;
        },
        onSuccess: () => {
            refetch(); 
           
        },
        onError: (error) => {
            console.error("Add Error:", error);
            toast.error("Failed to add product");
        }
    });

   
    const { mutate: removeFromCart } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/carts/${id}`);
            return res.data;
        },
        onSuccess: () => {
            refetch();
            toast.success("Item removed");
        },
        onError: () => {
            toast.error("Could not remove item");
        }
    });

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, refetch }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;