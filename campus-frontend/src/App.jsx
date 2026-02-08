import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Login />;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "staff") {
    return <StaffDashboard />;
  }

  return <StudentDashboard />;
}

export default App;
