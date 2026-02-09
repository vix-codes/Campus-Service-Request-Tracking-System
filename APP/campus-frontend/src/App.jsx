import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";
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
        <StaffDashboard />
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar__brand">Apartment Service</div>
        <NotificationBell />
      </div>
      <StudentDashboard />
    </>
  );
}

export default App;
