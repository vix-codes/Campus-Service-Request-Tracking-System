import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";

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
