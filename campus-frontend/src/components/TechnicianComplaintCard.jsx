import { useState } from "react";

import API from "../services/api";

const TechnicianComplaintCard = ({ complaint }) => {
  const [status, setStatus] = useState(complaint.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await API.patch(`/complaints/${complaint._id}`, { status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      <h3>{complaint.title}</h3>
      <p>{complaint.description}</p>
      <div>
        Status:
        <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <p>Created at: {new Date(complaint.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default TechnicianComplaintCard;
