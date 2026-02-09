import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";
import NoticeBanner from "../components/NoticeBanner";

function AdminDashboard() {
  const role = localStorage.getItem("role");
  const [complaints, setComplaints] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianByComplaintId, setSelectedTechnicianByComplaintId] = useState({});
  const [notice, setNotice] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [newUserRole,setNewUserRole]=useState("tenant");

  useEffect(() => {
    fetchComplaints();
    fetchTechnicians();
    fetchAnalytics();
  }, []);

  const fetchComplaints = async () => {
    const res = await API.get("/complaints");
    setComplaints(res.data.data);
  };

  const fetchTechnicians = async () => {
    const res = await API.get("/auth/technicians");
    setTechnicians(res.data.data);
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await API.get("/api/admin/analytics");
      setAnalytics(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const formatDuration = (ms) => {
    if (!ms || ms <= 0) return "0h 0m";
    const totalMinutes = Math.round(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const assign = async (id) => {
    const technicianId = selectedTechnicianByComplaintId[id];
    if (!technicianId) {
      setNotice({ tone: "error", message: "Select a technician to assign." });
      return;
    }

    try {
      await API.put(`/complaints/assign/${id}`, {
        technicianId,
      });
      setNotice({ tone: "success", message: "Complaint assigned successfully." });
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: "Unable to assign complaint." });
    }

    setSelectedTechnicianByComplaintId((prev) => ({ ...prev, [id]: "" }));
    fetchComplaints();
  };

  const deleteComplaint = async (id) => {
    try {
      await API.delete(`/complaints/${id}`);
      setNotice({ tone: "success", message: "Complaint deleted." });
      fetchComplaints();
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: "Unable to delete complaint." });
    }
  };

  const closeComplaint = async (id) => {
    try {
      await API.put(`/complaints/status/${id}`, {
        status: "CLOSED",
      });
      setNotice({ tone: "success", message: "Complaint closed." });
      fetchComplaints();
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: "Unable to close complaint." });
    }
  };

  const reopenComplaint = async (id) => {
    try {
      await API.put(`/complaints/status/${id}`, {
        status: "NEW",
      });
      setNotice({ tone: "success", message: "Complaint reopened." });
      fetchComplaints();
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: "Unable to reopen complaint." });
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/create-user", {
        name,
        email,
        password,
        role: newUserRole,
      });

      setNotice({ tone: "success", message: "User created successfully." });
      setName(""); setEmail(""); setPassword("");
      fetchTechnicians();
    } catch {
      setNotice({ tone: "error", message: "Error creating user." });
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2>{role === "manager" ? "Manager Dashboard" : "Admin Dashboard"}</h2>
          <p className="muted">Manage complaints and assignments.</p>
        </div>
        <button className="button button--ghost" onClick={logout}>Logout</button>
      </div>

      <NoticeBanner
        message={notice?.message}
        tone={notice?.tone}
        onClose={() => setNotice(null)}
      />

      {/* ANALYTICS */}
      {(role === "admin" || role === "manager") && (
        <div className="section">
          <div className="card">
            <div className="card__header">
              <div>
                <h3>System Analytics</h3>
                <p className="muted">Live performance snapshot.</p>
              </div>
              <button
                className="button button--ghost"
                type="button"
                onClick={fetchAnalytics}
              >
                Refresh
              </button>
            </div>

            {analyticsLoading && <p className="muted">Loading analytics...</p>}

            {!analyticsLoading && analytics && (
              <>
                <div className="grid">
                  <div className="card">
                    <h4>Overview</h4>
                    <p>Total: {analytics.overview.totalComplaints}</p>
                    <p>New: {analytics.overview.open}</p>
                    <p>Assigned: {analytics.overview.assigned}</p>
                    <p>In Progress: {analytics.overview.inProgress}</p>
                    <p>Completed: {analytics.overview.completed}</p>
                    <p>Closed: {analytics.overview.closed}</p>
                    <p>Rejected: {analytics.overview.rejected}</p>
                  </div>

                  <div className="card">
                    <h4>Priority</h4>
                    <p>Critical: {analytics.priority.critical}</p>
                    <p>High: {analytics.priority.high}</p>
                  </div>

                  <div className="card">
                    <h4>Time</h4>
                    <p>Avg resolution: {formatDuration(analytics.time.avgResolutionMs)}</p>
                    <p>Today created: {analytics.time.todayCreated}</p>
                    <p>Today closed: {analytics.time.todayClosed}</p>
                  </div>

                  <div className="card">
                    <h4>Technicians</h4>
                    <p>Total: {analytics.technicians.total}</p>
                  </div>
                </div>

                <div className="section">
                  <h4>Technician Performance</h4>
                  {analytics.technicians.performance.length === 0 && (
                    <p className="muted">No completed complaints yet.</p>
                  )}
                  {analytics.technicians.performance.map((t) => (
                    <div key={t.technicianId} className="card">
                      <p>{t.name || "Unknown"}</p>
                      <p>Completed: {t.completedCount}</p>
                      <p>Avg completion: {formatDuration(t.avgCompletionMs)}</p>
                    </div>
                  ))}
                </div>

                <div className="section">
                  <h4>Pending Per Technician</h4>
                  {analytics.technicians.pending.length === 0 && (
                    <p className="muted">No pending assignments.</p>
                  )}
                  {analytics.technicians.pending.map((t) => (
                    <div key={t.technicianId} className="card">
                      <p>{t.name || "Unknown"}</p>
                      <p>Pending: {t.pendingCount}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CREATE USER (admin only, collapsible) */}
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
            <form onSubmit={createUser} className="form form--grid">
              <label className="form__label">
                Name
                <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>
              </label>

              <label className="form__label">
                Email
                <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
              </label>

              <label className="form__label">
                Password
                <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
              </label>

              <label className="form__label">
                Role
                <select value={newUserRole} onChange={e=>setNewUserRole(e.target.value)}>
                  <option value="tenant">Tenant</option>
                  <option value="technician">Technician</option>
                  <option value="manager">Manager</option>
                </select>
              </label>

              <div className="form__actions">
                <button className="button button--primary">Create User</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* complaints */}
      <div className="section">
        <h3>All Complaints</h3>
        <div className="grid">
          {complaints.map((req) => (
            <div key={req._id} className="card">
              <div className="card__header">
                <div>
                  <h4>{req.title}</h4>
                  <p className="muted">{req.description}</p>
                </div>
                <span className={`status status--${req.status?.toLowerCase().replaceAll("_", "-")}`}>
                  {req.status?.replaceAll("_", " ")}
                </span>
              </div>

              {req.image && (
                <img className="card__image" src={req.image} alt={`${req.title} evidence`} />
              )}

              <div className="card__meta">
                {req.token && <p>Token: {req.token}</p>}
                {req.priority && <p>Priority: {req.priority}</p>}
                {req.createdBy && <p>By: {req.createdBy.name}</p>}
                {req.assignedTo && <p>Technician: {req.assignedTo.name}</p>}
                {req.createdAt && <p>Created: {new Date(req.createdAt).toLocaleString()}</p>}
                {req.assignedAt && <p>Assigned: {new Date(req.assignedAt).toLocaleString()}</p>}
                {req.completedAt && <p>Completed: {new Date(req.completedAt).toLocaleString()}</p>}
                {req.closedAt && <p>Closed: {new Date(req.closedAt).toLocaleString()}</p>}
              </div>

              <div className="card__actions">
                {["NEW", "REJECTED"].includes(req.status) && (
                  <>
                    <select
                      className="select"
                      value={selectedTechnicianByComplaintId[req._id] || ""}
                      onChange={(e) =>
                        setSelectedTechnicianByComplaintId((prev) => ({
                          ...prev,
                          [req._id]: e.target.value,
                        }))
                      }
                    >
                      <option value="" disabled>Select technician</option>
                      {technicians.map(s=>(
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>

                    <button className="button button--primary" onClick={()=>assign(req._id)}>Assign</button>
                  </>
                )}
                {req.status === "COMPLETED" && (
                  <button className="button button--success" onClick={()=>closeComplaint(req._id)}>
                    Close
                  </button>
                )}
                {req.status === "CLOSED" && (
                  <button className="button button--ghost" onClick={()=>reopenComplaint(req._id)}>
                    Reopen
                  </button>
                )}
                {role === "admin" && (
                  <button className="button button--danger" onClick={()=>deleteComplaint(req._id)}>Delete</button>
                )}
              </div>
            </div>
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
