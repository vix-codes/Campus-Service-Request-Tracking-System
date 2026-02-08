import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";
import NoticeBanner from "../components/NoticeBanner";

function StudentDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [requests, setRequests] = useState([]);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests");
      setRequests(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createRequest = async (e) => {
    e.preventDefault();

    try {
      await API.post("/requests", {
        title,
        description,
        image,
      });

      setNotice({ tone: "success", message: "Request created successfully." });
      setTitle("");
      setDescription("");
      setImage("");
      fetchRequests();
    } catch {
      setNotice({ tone: "error", message: "Error creating request." });
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
          <h2>Student Dashboard</h2>
          <p className="muted">Create and track your service requests.</p>
        </div>
        <button className="button button--ghost" onClick={logout}>Logout</button>
      </div>

      <NoticeBanner
        message={notice?.message}
        tone={notice?.tone}
        onClose={() => setNotice(null)}
      />

      <div className="card">
        <h3>Create Request</h3>

        <form onSubmit={createRequest} className="form">
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
            Submit Request
          </button>
        </form>
      </div>

      <div className="section">
        <h3>All Requests</h3>

        <div className="grid">
          {requests.map((req) => (
            <div
              key={req._id}
              className="card"
            >
              <div className="card__header">
                <div>
                  <h4>{req.title}</h4>
                  <p className="muted">{req.description}</p>
                </div>
                <span className={`status status--${req.status?.toLowerCase().replace(" ", "-")}`}>
                  {req.status}
                </span>
              </div>

              {req.image && <img className="card__image" src={req.image} alt={`${req.title} evidence`} />}

              <div className="card__meta">
                {req.createdAt && (
                  <p>
                    Created: {new Date(req.createdAt).toLocaleString()}
                  </p>
                )}

                {req.assignedTo && (
                  <p>Assigned to: {req.assignedTo.name}</p>
                )}

                {req.closedAt && (
                  <p>
                    Closed: {new Date(req.closedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActivityFeed />
    </div>
  );
}

export default StudentDashboard;
