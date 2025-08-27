import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isLoggedIn = !!(token && user);
  
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;