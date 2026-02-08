import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";
import NoticeBanner from "../components/NoticeBanner";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaffByRequestId, setSelectedStaffByRequestId] = useState({});
  const [notice, setNotice] = useState(null);

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("staff");

  useEffect(() => {
    fetchRequests();
    fetchStaff();
  }, []);

  const fetchRequests = async () => {
    const res = await API.get("/requests");
    setRequests(res.data.data);
  };

  const fetchStaff = async () => {
    const res = await API.get("/auth/staff");
    setStaff(res.data.data);
  };

  const assign = async (id) => {
    const staffId = selectedStaffByRequestId[id];
    if (!staffId) {
      setNotice({ tone: "error", message: "Select a staff member to assign." });
      return;
    }

    try {
      await API.put(`/requests/assign/${id}`, {
        staffId,
      });
      setNotice({ tone: "success", message: "Request assigned successfully." });
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: "Unable to assign request." });
    }

    setSelectedStaffByRequestId((prev) => ({ ...prev, [id]: "" }));
    fetchRequests();
  };

  const deleteReq = async (id) => {
    try {
      await API.delete(`/requests/${id}`);
      setNotice({ tone: "success", message: "Request deleted." });
      fetchRequests();
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: "Unable to delete request." });
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/create-user", {
        name,
        email,
        password,
        role,
      });

      setNotice({ tone: "success", message: "User created successfully." });
      setName(""); setEmail(""); setPassword("");
      fetchStaff();
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
          <h2>Admin Dashboard</h2>
          <p className="muted">Manage users and campus requests.</p>
        </div>
        <button className="button button--ghost" onClick={logout}>Logout</button>
      </div>

      <NoticeBanner
        message={notice?.message}
        tone={notice?.tone}
        onClose={() => setNotice(null)}
      />

      {/* CREATE USER */}
      <div className="card">
        <h3>Create Staff/Admin</h3>
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
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="form__actions">
            <button className="button button--primary">Create User</button>
          </div>
        </form>
      </div>

      {/* REQUESTS */}
      <div className="section">
        <h3>All Requests</h3>
        <div className="grid">
          {requests.map((req) => (
            <div key={req._id} className="card">
              <div className="card__header">
                <div>
                  <h4>{req.title}</h4>
                  <p className="muted">{req.description}</p>
                </div>
                <span className={`status status--${req.status?.toLowerCase().replace(" ", "-")}`}>
                  {req.status}
                </span>
              </div>

              {req.image && (
                <img className="card__image" src={req.image} alt={`${req.title} evidence`} />
              )}

              <div className="card__meta">
                {req.createdBy && <p>By: {req.createdBy.name}</p>}
                {req.assignedTo && <p>Staff: {req.assignedTo.name}</p>}
                {req.createdAt && <p>Created: {new Date(req.createdAt).toLocaleString()}</p>}
                {req.assignedAt && <p>Assigned: {new Date(req.assignedAt).toLocaleString()}</p>}
                {req.closedAt && <p>Closed: {new Date(req.closedAt).toLocaleString()}</p>}
              </div>

              <div className="card__actions">
                {!req.assignedTo && (
                  <>
                    <select
                      className="select"
                      value={selectedStaffByRequestId[req._id] || ""}
                      onChange={(e) =>
                        setSelectedStaffByRequestId((prev) => ({
                          ...prev,
                          [req._id]: e.target.value,
                        }))
                      }
                    >
                      <option value="" disabled>Select staff</option>
                      {staff.map(s=>(
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>

                    <button className="button button--primary" onClick={()=>assign(req._id)}>Assign</button>
                  </>
                )}
                <button className="button button--danger" onClick={()=>deleteReq(req._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActivityFeed />
    </div>
  );
}

export default AdminDashboard;
