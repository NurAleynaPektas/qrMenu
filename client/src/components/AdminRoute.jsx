import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("AdminRoute state:", { user, isAdmin }); // debug

  if (!user || !isAdmin) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
