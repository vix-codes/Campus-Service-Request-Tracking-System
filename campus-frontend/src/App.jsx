import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import NotificationBell from "./components/NotificationBell";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Login />;
  }

  if (role === "admin" || role === "manager") {
    return (
      <>
        <div className="topbar">
          <div className="topbar__brand">Apartment Service</div>
          <NotificationBell />
        </div>
        <AdminDashboard />
      </>
    );
  }

  if (role === "technician") {
    return (
      <>
        <div className="topbar">
          <div className="topbar__brand">Apartment Service</div>
          <NotificationBell />
        </div>
        <TechnicianDashboard />
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar__brand">Apartment Service</div>
        <NotificationBell />
      </div>
      <TenantDashboard />
    </>
  );
}

export default App;
