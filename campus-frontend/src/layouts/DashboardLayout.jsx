
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "../components/NotificationBell";

const DashboardLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <>
      <div className="topbar">
        <div className="topbar__brand">Apartment Service</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <NotificationBell />
          <button
            onClick={logout}
            className="button button--ghost button--small"
          >
            Logout
          </button>
        </div>
      </div>
      {children}
    </>
  );
};

export default DashboardLayout;
