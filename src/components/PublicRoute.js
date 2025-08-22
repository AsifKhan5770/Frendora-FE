import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("user");
  return !isLoggedIn ? children : <Navigate to="/posts" />;
};

export default PublicRoute;