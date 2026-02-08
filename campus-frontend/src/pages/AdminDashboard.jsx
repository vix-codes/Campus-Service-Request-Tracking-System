import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    fetchRequests();
    fetchStaff();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests");
      setRequests(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await API.get("/auth/staff");
      setStaff(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const assign = async (id) => {
    if (!selectedStaff) {
      alert("Select staff");
      return;
    }

    try {
      await API.put(`/requests/assign/${id}`, {
        staffId: selectedStaff,
      });

      alert("Assigned");
      fetchRequests();
    } catch (err) {
      alert("Error assigning");
    }
  };

  const deleteReq = async (id) => {
    if (!window.confirm("Delete request?")) return;

    await API.delete(`/requests/${id}`);
    fetchRequests();
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>
      <h2>Admin Dashboard</h2>

      {requests.map((req) => (
        <div
          key={req._id}
          style={{ border: "1px solid gray", margin: 10, padding: 10 }}
        >
          <b>{req.title}</b>
          <p>{req.description}</p>

          {req.image && <img src={req.image} width="200" />}

          <p>Status: {req.status}</p>

          {req.createdBy && (
            <p>Created by: {req.createdBy.name}</p>
          )}

          <p>
            Created:{" "}
            {req.createdAt &&
              new Date(req.createdAt).toLocaleString()}
          </p>

          {req.assignedAt && (
            <p>
              Assigned time:{" "}
              {new Date(req.assignedAt).toLocaleString()}
            </p>
          )}

          {req.closedAt && (
            <p>
              Closed time:{" "}
              {new Date(req.closedAt).toLocaleString()}
            </p>
          )}

          {req.assignedTo ? (
            <p>
              Assigned to: <b>{req.assignedTo.name}</b>
            </p>
          ) : (
            <>
              <select
                onChange={(e) =>
                  setSelectedStaff(e.target.value)
                }
              >
                <option value="">Select staff</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button onClick={() => assign(req._id)}>
                Assign
              </button>
            </>
          )}

          <br />
          <button onClick={() => deleteReq(req._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
