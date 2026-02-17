import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecures";
import useAuth from "../../../hooks/useAuth";



export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    
    
    const [localCart, setLocalCart] = useState([]);

    
    const { data: dbCart = [], refetch } = useQuery({
        queryKey: ['cart', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?email=${user.email}`);
            return res.data;
        }
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setLocalCart(storedCart);
    }, []);

  
    const addToCart = (product) => {
        if (user?.email) {
       
            dbAddToCart(product);
        } else {
         
            const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
          
            const isExist = existingCart.find(item => item._id === product._id);
            
            let newCart;
            if (isExist) {
                newCart = existingCart.map(item => 
                    item._id === product._id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
                );
            } else {
                newCart = [...existingCart, { ...product, quantity: product.quantity || 1 }];
            }
            
            localStorage.setItem('cart', JSON.stringify(newCart));
            setLocalCart(newCart); 
          
        }
    };


    const { mutate: dbAddToCart } = useMutation({
        mutationFn: async (product) => {
            const cartItem = {
                productId: product.originalId || product._id, 
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,
                email: user.email,
                quantity: product.quantity || 1
            };
            const res = await axiosSecure.post('/carts', cartItem);
            return res.data;
        },
        onSuccess: () => {
            refetch();
           
        }
    });

  
    const removeFromCart = (id) => {
        if (user?.email) {
            dbRemoveFromCart(id);
        } else {
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = currentCart.filter(item => item._id !== id);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setLocalCart(updatedCart);
            toast.success("Removed from local storage");
        }
    };

    const { mutate: dbRemoveFromCart } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/carts/${id}`);
            return res.data;
        },
        onSuccess: () => refetch()
    });


    const finalCart = user?.email ? dbCart : localCart;

    return (
        <CartContext.Provider value={{ cart: finalCart, addToCart, removeFromCart, refetch }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;