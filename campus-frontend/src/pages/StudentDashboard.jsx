import CreateRequest from "./CreateRequest";
import ViewRequests from "./ViewRequests";

function StudentDashboard() {

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>

      <h2>Student Dashboard</h2>

      <div style={{ marginTop: 20 }}>
        <h3>Create Request</h3>
        <CreateRequest />
      </div>

      <hr />

      <div>
        <h3>My Requests</h3>
        <ViewRequests />
      </div>
    </div>
  );
}

export default StudentDashboard;
