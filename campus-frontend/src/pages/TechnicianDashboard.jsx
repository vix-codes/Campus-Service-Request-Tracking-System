import { useEffect, useState } from "react";
import API from "../services/api";
import NoticeBanner from "../components/NoticeBanner";

function TechnicianDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const startWork = async (id) => {
    try {
      await API.put(`/complaints/status/${id}`, {
        status: "IN_PROGRESS",
      });

      setNotice({ tone: "success", message: "Marked as in progress." });
      fetchComplaints();
    } catch {
      setNotice({ tone: "error", message: "Unable to update status." });
    }
  };

  const completeTask = async (id) => {
    try {
      await API.put(`/complaints/status/${id}`, {
        status: "COMPLETED",
      });

      setNotice({ tone: "success", message: "Marked as completed." });
      fetchComplaints();
    } catch {
      setNotice({ tone: "error", message: "Unable to update status." });
    }
  };

  const rejectTask = async (id) => {
    if (!reason) {
      setNotice({ tone: "error", message: "Enter a rejection reason." });
      return;
    }

    try {
      await API.put(`/complaints/status/${id}`, {
        status: "REJECTED",
        reason: reason,
      });

      setReason("");
      setNotice({ tone: "success", message: "Complaint rejected." });
      fetchComplaints();
    } catch {
      setNotice({ tone: "error", message: "Unable to reject complaint." });
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
          <h2>Technician Dashboard</h2>
          <p className="muted">Track and resolve assigned complaints.</p>
        </div>
        <button className="button button--ghost" onClick={logout}>Logout</button>
      </div>

      <NoticeBanner
        message={notice?.message}
        tone={notice?.tone}
        onClose={() => setNotice(null)}
      />

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
                <p>Created: {new Date(req.createdAt).toLocaleString()}</p>
              )}

              {req.assignedAt && (
                <p>Assigned: {new Date(req.assignedAt).toLocaleString()}</p>
              )}
            </div>

            <div className="card__actions">
              {req.status === "ASSIGNED" && (
                <button className="button button--primary" onClick={() => startWork(req._id)}>
                  Start Work
                </button>
              )}

              {req.status === "IN_PROGRESS" && (
                <>
                  <button className="button button--success" onClick={() => completeTask(req._id)}>
                    Complete
                  </button>

                  <input
                    className="input"
                    placeholder="Reject reason"
                    value={reason}
                    onChange={(e)=>setReason(e.target.value)}
                  />

                  <button className="button button--danger" onClick={() => rejectTask(req._id)}>
                    Reject
                  </button>
                </>
              )}

              {req.status === "COMPLETED" && <span className="status status--completed">Completed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnicianDashboard;
