import { createBrowserRouter } from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../pages/Home/Home/Home";
import AuthLayouts from "../layouts/AuthLayouts";

import NotFound from "../pages/Notfund/NotFound";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashBoardLayout";
import AddProducts from "../pages/DashBorad/AddProducts/AddProducts";

import AllProducts from "../pages/shop/AllProducts";
import ProductDetails from "../pages/ProductDetails/ProductDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "allproducts",
        Component: AllProducts,
      },
      {
        path: "product/:id",
        element: <ProductDetails></ProductDetails>,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayouts,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "addproducts",
        element: <AddProducts />,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
