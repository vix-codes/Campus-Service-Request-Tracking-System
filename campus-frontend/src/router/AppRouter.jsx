
import { useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";

const AppRouter = () => {
  const { role } = useAuth();

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

  return <DashboardLayout>{dashboardComponent}</DashboardLayout>;
};

export default AppRouter;
