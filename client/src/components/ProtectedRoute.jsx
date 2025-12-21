import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo,
}) {
  const { user, role } = useSelector((state) => state.auth);
  const location = useLocation();

  const from = `${location.pathname}${location.search}${location.hash}`;

  if (!user) {
    return <Navigate to={redirectTo || "/login"} replace state={{ from }} />;
  }

  const currentRole = role || "staff";

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to={redirectTo || "/"} replace state={{ from }} />;
  }

  return children;
}
