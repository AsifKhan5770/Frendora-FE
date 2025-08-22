import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("user"); // user stored after login
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;