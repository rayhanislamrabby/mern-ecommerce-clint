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

import ProductDetails from "../pages/ProductDetails/ProductDetails";
import AllProducts from "../pages/shop/AllProducts";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import AddProduct from "../pages/DashBorad/AddProducts/AddProducts";
import AdminProducts from "../pages/DashBorad/AdminProducts/AdminProducts";
import EditProduct from "../pages/DashBorad/EditProduct/EditProduct";

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
        path: "/category/:categoryName",
        element: <CategoryPage></CategoryPage>,
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
      {
        path: "adminproducts",
        element: <AdminProducts></AdminProducts>,
      },
      {
        path: "edit-product/:id",
        element: <EditProduct></EditProduct>,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
