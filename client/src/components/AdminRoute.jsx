import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const location = useLocation();

  console.log("AdminRoute isAdmin:", isAdmin);

  
  if (!isAdmin) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  
  return children;
}
