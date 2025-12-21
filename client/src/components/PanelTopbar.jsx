import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "../redux/authSlice";
import s from "./PanelTopbar.module.css";

export default function PanelTopbar({ title = "Panel" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toastSuccess("Çıkış yapıldı");
    navigate("/", { replace: true });
  };

  return (
    <header className={s.bar}>
      <div className={s.left}>
        <div className={s.title}>{title}</div>
        {user?.email && <div className={s.sub}>{user.email}</div>}
      </div>

      <button
        type="button"
        className={s.logoutBtn}
        onClick={handleLogout}
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={18} strokeWidth={2.2} />
        <span className={s.logoutText}>Logout</span>
      </button>
    </header>
  );
}
