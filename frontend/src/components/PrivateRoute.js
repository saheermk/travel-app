import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user_data"));

  if (!user?.access) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};


export default PrivateRoute;
