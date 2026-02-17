import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AuthProvider from "./context/AuthContext/AuthProvider";

import { Toaster } from "react-hot-toast";
import CartProvider from "./context/AuthContext/CartContext/CartProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <div className="font-inter">
            <RouterProvider router={router} />
            <Toaster position="top-center" />
          </div>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
