import { useEffect, useState } from "react";
import API from "../services/api";
import NoticeBanner from "../components/NoticeBanner";

function TenantDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createComplaint = async (e) => {
    e.preventDefault();

    try {
      await API.post("/complaints", {
        title,
        description,
        image,
      });

      setNotice({ tone: "success", message: "Complaint created successfully." });
      setTitle("");
      setDescription("");
      setImage("");
      fetchComplaints();
    } catch {
      setNotice({ tone: "error", message: "Error creating complaint." });
    }
  };

  const reopenComplaint = async (id) => {
    try {
      await API.put(`/complaints/status/${id}`, {
        status: "NEW",
      });
      setNotice({ tone: "success", message: "Complaint reopened." });
      fetchComplaints();
    } catch {
      setNotice({ tone: "error", message: "Unable to reopen complaint." });
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
          <h2>Tenant Dashboard</h2>
          <p className="muted">Create and track your complaints.</p>
        </div>
        <button className="button button--ghost" onClick={logout}>Logout</button>
      </div>

      <NoticeBanner
        message={notice?.message}
        tone={notice?.tone}
        onClose={() => setNotice(null)}
      />

      <div className="card">
        <h3>Create Complaint</h3>

        <form onSubmit={createComplaint} className="form">
          <label className="form__label">
            Title
            <input
              placeholder="e.g., Broken door lock"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              required
            />
          </label>

          <label className="form__label">
            Description
            <textarea
              placeholder="Describe the issue"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              required
            />
          </label>

          <label className="form__label">
            Image URL (optional)
            <input
              placeholder="https://"
              value={image}
              onChange={(e)=>setImage(e.target.value)}
            />
          </label>

          <button className="button button--primary" type="submit">
            Submit Complaint
          </button>
        </form>
      </div>

      <div className="section">
        <h3>All Complaints</h3>

        <div className="grid">
          {complaints.map((req) => (
            <div
              key={req._id}
              className="card"
            >
              <div className="card__header">
                <div>
                  <h4>{req.title}</h4>
                  <p className="muted">{req.description}</p>
                </div>
                <span className={`status status--${req.status?.toLowerCase().replaceAll("_", "-")}`}>
                  {req.status?.replaceAll("_", " ")}
                </span>
              </div>

              {req.image && <img className="card__image" src={req.image} alt={`${req.title} evidence`} />}

              <div className="card__meta">
                {req.token && (
                  <p>Token: {req.token}</p>
                )}
                {req.priority && (
                  <p>Priority: {req.priority}</p>
                )}
                {req.createdAt && (
                  <p>
                    Created: {new Date(req.createdAt).toLocaleString()}
                  </p>
                )}

                {req.assignedTo && (
                  <p>Assigned to: {req.assignedTo.name}</p>
                )}

                {req.rejectReason && (
                  <p>Rejection: {req.rejectReason}</p>
                )}

                {req.closedAt && (
                  <p>
                    Closed: {new Date(req.closedAt).toLocaleString()}
                  </p>
                )}
              </div>

              {req.status === "REJECTED" && (
                <div className="card__actions">
                  <button className="button button--ghost" onClick={() => reopenComplaint(req._id)}>
                    Reopen Complaint
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TenantDashboard;
