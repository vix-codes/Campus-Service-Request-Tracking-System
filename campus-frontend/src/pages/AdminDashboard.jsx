
import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";
import NoticeBanner from "../components/NoticeBanner";

// A reusable hook for fetching data
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get(url);
      setData(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

// A component for the analytics section
const Analytics = ({ role, analytics, loading, onRefresh }) => {
  const formatDuration = (ms) => {
    if (!ms || ms <= 0) return "0h 0m";
    const totalMinutes = Math.round(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="section">
      <div className="card">
        <div className="card__header">
          <div>
            <h3>System Analytics</h3>
            <p className="muted">Live performance snapshot.</p>
          </div>
          <button className="button button--ghost" type="button" onClick={onRefresh}>
            Refresh
          </button>
        </div>

        {loading && <p className="muted">Loading analytics...</p>}

        {!loading && analytics && (
          <>
            <div className="grid">
              <div className="card">
                <h4>Overview</h4>
                <p>Total: {analytics.overview.totalComplaints}</p>
                <p>New: {analytics.overview.open}</p>
                <p>Assigned: {analytics.overview.assigned}</p>
                <p>In Progress: {analytics.overview.inProgress}</p>
              </div>

              <div className="card">
                <h4>Performance</h4>
                <p>Avg resolution: {formatDuration(analytics.time.avgResolutionMs)}</p>
                <p>Today created: {analytics.time.todayCreated}</p>
                <p>Today closed: {analytics.time.todayClosed}</p>
              </div>

              <div className="card">
                <h4>Technicians</h4>
                <p>Total: {analytics.technicians.total}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// A component for creating a new user
const CreateUserForm = ({ onUserCreated, setNotice }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/create-user", { name, email, password, role });
      setNotice({ tone: "success", message: "User created successfully." });
      setName("");
      setEmail("");
      setPassword("");
      onUserCreated();
    } catch {
      setNotice({ tone: "error", message: "Error creating user." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form form--grid">
      <label className="form__label">
        Name
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="form__label">
        Email
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="form__label">
        Password
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label className="form__label">
        Role
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="tenant">Tenant</option>
          <option value="technician">Technician</option>
          <option value="manager">Manager</option>
        </select>
      </label>
      <div className="form__actions">
        <button className="button button--primary">Create User</button>
      </div>
    </form>
  );
};

// A component to display and manage a single complaint
const ComplaintCard = ({
  complaint,
  technicians,
  onAssign,
  onClose,
  onReopen,
  onDelete,
}) => {
  const [selectedTechnician, setSelectedTechnician] = useState("");

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h4>{complaint.title}</h4>
          <p className="muted">{complaint.description}</p>
        </div>
        <span className={`status status--${complaint.status?.toLowerCase().replaceAll("_", "-")}`}>
          {complaint.status?.replaceAll("_", " ")}
        </span>
      </div>

      {complaint.image && (
        <img
          className="card__image"
          src={complaint.image}
          alt={`${complaint.title} evidence`}
        />
      )}

      <div className="card__meta">
        {complaint.createdBy && <p>By: {complaint.createdBy.name}</p>}
        {complaint.assignedTo && <p>Technician: {complaint.assignedTo.name}</p>}
        {complaint.createdAt && (
          <p>Created: {new Date(complaint.createdAt).toLocaleString()}</p>
        )}
      </div>

      <div className="card__actions">
        {["NEW", "REJECTED"].includes(complaint.status) && (
          <>
            <select
              className="select"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              <option value="" disabled>
                Select technician
              </option>
              {technicians.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              className="button button--primary"
              onClick={() => onAssign(complaint._id, selectedTechnician)}
            >
              Assign
            </button>
          </>
        )}
        {complaint.status === "COMPLETED" && (
          <button
            className="button button--success"
            onClick={() => onClose(complaint._id)}
          >
            Close
          </button>
        )}
        {complaint.status === "CLOSED" && (
          <button
            className="button button--ghost"
            onClick={() => onReopen(complaint._id)}
          >
            Reopen
          </button>
        )}
        <button
          className="button button--danger"
          onClick={() => onDelete(complaint._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const role = localStorage.getItem("role");
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
