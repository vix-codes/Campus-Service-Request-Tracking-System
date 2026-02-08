import { useEffect, useState } from "react";
import API from "../services/api";

function StaffDashboard() {
  const [requests, setRequests] = useState([]);

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

  const updateStatus = async (id, status) => {
    try {
      if (status === "Rejected") {
        const reason = prompt("Enter reject reason");
        if (!reason) return;

        await API.put(`/requests/staff-status/${id}`, {
          status: "Rejected",
          reason: reason,
        });
      } else {
        await API.put(`/requests/staff-status/${id}`, { status });
      }

      fetchRequests();
    } catch (err) {
      alert("Error updating");
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
        .filter((r) => r.assignedTo)
        .map((req) => (
          <div
            key={req._id}
            style={{ border: "1px solid gray", margin: 10, padding: 10 }}
          >
            <b>{req.title}</b>
            <p>{req.description}</p>

            {req.image && <img src={req.image} width="200" />}

            <p>Status: {req.status}</p>

            {req.assignedTo && (
              <p>Assigned to: {req.assignedTo.name}</p>
            )}

            <p>
              Created:{" "}
              {req.createdAt &&
                new Date(req.createdAt).toLocaleString()}
            </p>

            {req.assignedAt && (
              <p>
                Assigned:{" "}
                {new Date(req.assignedAt).toLocaleString()}
              </p>
            )}

            {req.status !== "Closed" && (
              <>
                <button
                  onClick={() =>
                    updateStatus(req._id, "In Progress")
                  }
                >
                  Start
                </button>

                <button
                  onClick={() =>
                    updateStatus(req._id, "Closed")
                  }
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    updateStatus(req._id, "Rejected")
                  }
                >
                  Reject
                </button>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default StaffDashboard;
