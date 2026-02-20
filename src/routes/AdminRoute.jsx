import React, { Children } from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useuserRole";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({children}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { userRole, isRoleLoading } = useUserRole();

  if (loading || isRoleLoading) {
    return <span className="loading loading-bars loading-xl"></span>;
  }

  if (!user || userRole !== "admin") {
    return <Navigate to="/notfound" state={location.pathname} replace></Navigate>
  }

  return children;
};

export default AdminRoute;
