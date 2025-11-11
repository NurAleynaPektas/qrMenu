import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAdmin) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
