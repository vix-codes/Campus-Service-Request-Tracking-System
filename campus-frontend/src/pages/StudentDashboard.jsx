import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";

function StudentDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
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

  const createRequest = async (e) => {
    e.preventDefault();

    try {
      await API.post("/requests", {
        title,
        description,
        image,
      });

      alert("Request created");
      setTitle("");
      setDescription("");
      setImage("");
      fetchRequests();
    } catch {
      alert("Error creating request");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>
      <h2>Student Dashboard</h2>

      <h3>Create Request</h3>

      <form onSubmit={createRequest}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
        />
        <br/><br/>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          required
        />
        <br/><br/>

        <input
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e)=>setImage(e.target.value)}
        />
        <br/><br/>

        <button type="submit">Submit Request</button>
      </form>

      <hr />

      <h3>All Requests</h3>

      {requests.map((req) => (
        <div
          key={req._id}
          style={{ border: "1px solid gray", margin: 10, padding: 10 }}
        >
          <b>{req.title}</b>
          <p>{req.description}</p>

          {req.image && <img src={req.image} width="200" />}

          <p>Status: {req.status}</p>

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
      ))}

      <ActivityFeed />
    </div>
  );
}

export default StudentDashboard;
