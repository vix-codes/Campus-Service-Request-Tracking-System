import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

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
    if (!selectedStaff) return alert("Select staff");

    await API.put(`/requests/assign/${id}`, {
      staffId: selectedStaff,
    });

    fetchRequests();
  };

  const deleteReq = async (id) => {
    if (!window.confirm("Delete request?")) return;

    await API.delete(`/requests/${id}`);
    fetchRequests();
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

      alert("User created");
      setName(""); setEmail(""); setPassword("");
      fetchStaff();
    } catch {
      alert("Error creating user");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>
      <h2>Admin Dashboard</h2>

      {/* CREATE USER */}
      <h3>Create Staff/Admin</h3>
      <form onSubmit={createUser}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
        <br/><br/>

        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <br/><br/>

        <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <br/><br/>

        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <br/><br/>

        <button>Create User</button>
      </form>

      <hr/>

      {/* REQUESTS */}
      <h3>All Requests</h3>

      {requests.map((req) => (
        <div key={req._id} style={{border:"1px solid gray",margin:10,padding:10}}>
          <b>{req.title}</b>
          <p>{req.description}</p>

          {req.image && <img src={req.image} width="200"/>}

          <p>Status: {req.status}</p>

          {req.createdBy && <p>By: {req.createdBy.name}</p>}
          {req.assignedTo && <p>Staff: {req.assignedTo.name}</p>}

          {req.createdAt && <p>Created: {new Date(req.createdAt).toLocaleString()}</p>}
          {req.assignedAt && <p>Assigned: {new Date(req.assignedAt).toLocaleString()}</p>}
          {req.closedAt && <p>Closed: {new Date(req.closedAt).toLocaleString()}</p>}

          {!req.assignedTo && (
            <>
              <select onChange={(e)=>setSelectedStaff(e.target.value)}>
                <option>Select staff</option>
                {staff.map(s=>(
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>

              <button onClick={()=>assign(req._id)}>Assign</button>
            </>
          )}

          <br/>
          <button onClick={()=>deleteReq(req._id)}>Delete</button>
        </div>
      ))}

      <ActivityFeed />
    </div>
  );
}

export default AdminDashboard;
