import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo,
}) {
  const { user, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Login yoksa
  if (!user) {
    return (
      <Navigate
        to={redirectTo || "/login"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Role kısıtı varsa
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={redirectTo || "/"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
