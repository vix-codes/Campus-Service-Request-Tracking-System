
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import NotificationBell from "./components/NotificationBell";

const handleLogout = () => {
  localStorage.clear();
  window.location.reload();
};

// A wrapper for the main dashboard layout
const Dashboard = ({ children }) => (
  <>
    <div className="topbar">
      <div className="topbar__brand">Apartment Service</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="button button--ghost button--small"
        >
          Logout
        </button>
      </div>
    </div>
    {children}
  </>
);

// A simple router to render the correct dashboard based on the user's role
const AppRouter = () => {
  const role = localStorage.getItem("role");

  let dashboardComponent;
  switch (role) {
    case "admin":
    case "manager":
      dashboardComponent = <AdminDashboard />;
      break;
    case "technician":
      dashboardComponent = <TechnicianDashboard />;
      break;
    default:
      dashboardComponent = <TenantDashboard />;
      break;
  }

  return <Dashboard>{dashboardComponent}</Dashboard>;
};

function App() {
  const token = localStorage.getItem("token");

  // If no token is found, render the Login page
  if (!token) {
    return <Login />;
  }

  // Otherwise, render the appropriate dashboard
  return <AppRouter />;
}

export default App;
