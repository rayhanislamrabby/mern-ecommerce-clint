import { createBrowserRouter } from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../pages/Home/Home/Home";
import AuthLayouts from "../layouts/AuthLayouts";

import NotFound from "../pages/Notfund/NotFound";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      {
        index: true,

        Component: Home,
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

  // ⭐ 404 route
  {
    path: "*",
    Component: NotFound,
  },
]);
