import { createBrowserRouter } from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../pages/Home/Home/Home";
import AuthLayouts from "../layouts/AuthLayouts";

import NotFound from "../pages/Notfund/NotFound";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";

import DashboardLayout from "../layouts/DashBoardLayout";
import AddProducts from "../pages/DashBorad/AddProducts/AddProducts";

import ProductDetails from "../pages/ProductDetails/ProductDetails";
import AllProducts from "../pages/shop/AllProducts";
import CategoryPage from "../pages/CategoryPage/CategoryPage";

import AdminProducts from "../pages/DashBorad/AdminProducts/AdminProducts";
import EditProduct from "../pages/DashBorad/EditProduct/EditProduct";
import Checkout from "../pages/checkout/Checkout";
import Payments from "../pages/checkout/Payments/Payments";
import AddCoupon from "../pages/DashBorad/Coupons/AddCoupon";
import ManageCoupons from "../pages/DashBorad/Coupons/ManageCoupons";
import MakeAsAdmin from "../pages/DashBorad/MakeAsAdmin/MakeAsAdmin";
import AdminRoute from "../routes/AdminRoute";
import PaidOders from "../pages/DashBorad/Oders/PaidOders";
import UnpaidOrders from "../pages/DashBorad/Oders/UnpaidOrders";

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

      {
        path: "/checkout",
        element: <Checkout></Checkout>,
      },
      {
        path: "payments",
        Component: Payments,
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
      <AdminRoute>
        <DashboardLayout></DashboardLayout>
      </AdminRoute>
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
      {
        path: "addcoupon",
        element: <AddCoupon></AddCoupon>,
      },
      {
        path: "managecoupons",
        element: <ManageCoupons></ManageCoupons>,
      },
      {
        path: "makeasdadmin",
        element: <MakeAsAdmin></MakeAsAdmin>,
      },
      {
        path: "PaidOders",
        element: <PaidOders></PaidOders>,
      },

      {
        path: "unpaidorders",
        element: <UnpaidOrders></UnpaidOrders>,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
