import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";

function StaffDashboard() {
  const [requests, setRequests] = useState([]);
  const [reason, setReason] = useState("");

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

  const startWork = async (id) => {
    try {
      await API.put(`/requests/status/${id}`, {
        status: "In Progress",
      });

      fetchRequests();
    } catch {
      alert("Error");
    }
  };

  const closeTask = async (id) => {
    try {
      await API.put(`/requests/status/${id}`, {
        status: "Closed",
      });

      fetchRequests();
    } catch {
      alert("Error");
    }
  };

  const rejectTask = async (id) => {
    if (!reason) {
      alert("Enter reason");
      return;
    }

    try {
      await API.put(`/requests/status/${id}`, {
        status: "Rejected",
        reason: reason,
      });

      setReason("");
      fetchRequests();
    } catch {
      alert("Error");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>
      <h2>Staff Dashboard</h2>

      {requests
        .filter(r => r.assignedTo)
        .map((req) => (
        <div
          key={req._id}
          style={{ border: "1px solid gray", margin: 10, padding: 10 }}
        >
          <b>{req.title}</b>
          <p>{req.description}</p>

          {req.image && <img src={req.image} width="200" />}

          <p>Status: {req.status}</p>

          {req.createdAt && (
            <p>Created: {new Date(req.createdAt).toLocaleString()}</p>
          )}

          {req.assignedAt && (
            <p>Assigned: {new Date(req.assignedAt).toLocaleString()}</p>
          )}

          {req.status === "Assigned" && (
            <button onClick={() => startWork(req._id)}>
              Start Work
            </button>
          )}

          {req.status === "In Progress" && (
            <>
              <button onClick={() => closeTask(req._id)}>
                Close
              </button>

              <br/><br/>
              <input
                placeholder="Reject reason"
                value={reason}
                onChange={(e)=>setReason(e.target.value)}
              />

              <button onClick={() => rejectTask(req._id)}>
                Reject
              </button>
            </>
          )}

          {req.status === "Closed" && <b>Closed ✔</b>}
        </div>
      ))}

      <ActivityFeed />
    </div>
  );
}

export default StaffDashboard;
