
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../services/api";
import useFetch from "../hooks/useFetch";
import ActivityFeed from "../components/ActivityFeed";
import Analytics from "../components/Analytics";
import ComplaintCard from "../components/ComplaintCard";
import CreateUserForm from "../components/CreateUserForm";
import NoticeBanner from "../components/NoticeBanner";

function AdminDashboard() {
  const { role } = useAuth();
  const [notice, setNotice] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const { data: complaints, refetch: fetchComplaints } = useFetch("/complaints");
  const { data: technicians, refetch: fetchTechnicians } = useFetch("/auth/technicians");
  const {
    data: analytics,
    loading: analyticsLoading,
    refetch: fetchAnalytics,
  } = useFetch("/api/admin/analytics");

  const handleApiCall = async (apiCall, successMessage, errorMessage) => {
    try {
      await apiCall();
      setNotice({ tone: "success", message: successMessage });
      fetchComplaints();
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: errorMessage });
    }
  };

  const assignComplaint = (id, technicianId) => {
    if (!technicianId) {
      setNotice({ tone: "error", message: "Select a technician to assign." });
      return;
    }
    handleApiCall(
      () => API.put(`/complaints/assign/${id}`, { technicianId }),
      "Complaint assigned successfully.",
      "Unable to assign complaint."
    );
  };

  const deleteComplaint = (id) => {
    handleApiCall(
      () => API.delete(`/complaints/${id}`),
      "Complaint deleted.",
      "Unable to delete complaint."
    );
  };

  const closeComplaint = (id) => {
    handleApiCall(
      () => API.put(`/complaints/status/${id}`, { status: "CLOSED" }),
      "Complaint closed.",
      "Unable to close complaint."
    );
  };

  const reopenComplaint = (id) => {
    handleApiCall(
      () => API.put(`/complaints/status/${id}`, { status: "NEW" }),
      "Complaint reopened.",
      "Unable to reopen complaint."
    );
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2>{role === "manager" ? "Manager Dashboard" : "Admin Dashboard"}</h2>
          <p className="muted">Manage complaints and assignments.</p>
        </div>
      </div>

      <NoticeBanner
        message={notice?.message}
        tone={notice?.tone}
        onClose={() => setNotice(null)}
      />

      {(role === "admin" || role === "manager") && (
        <Analytics
          role={role}
          analytics={analytics}
          loading={analyticsLoading}
          onRefresh={fetchAnalytics}
        />
      )}

      {role === "admin" && (
        <div className="card">
          <div className="card__header">
            <h3>Create User</h3>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => setShowCreateUser((prev) => !prev)}
            >
              {showCreateUser ? "Hide" : "Show"}
            </button>
          </div>
          {showCreateUser && (
            <CreateUserForm
              onUserCreated={fetchTechnicians}
              setNotice={setNotice}
            />
          )}
        </div>
      )}

      <div className="section">
        <h3>All Complaints</h3>
        <div className="grid">
          {complaints?.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              technicians={technicians || []}
              onAssign={assignComplaint}
              onClose={closeComplaint}
              onReopen={reopenComplaint}
              onDelete={deleteComplaint}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <button
          className="button button--ghost"
          type="button"
          onClick={() => setShowActivity((prev) => !prev)}
        >
          {showActivity ? "Hide full activity" : "Show full activity"}
        </button>
      </div>

      {showActivity && <ActivityFeed />}
    </div>
  );
}

export default AdminDashboard;
