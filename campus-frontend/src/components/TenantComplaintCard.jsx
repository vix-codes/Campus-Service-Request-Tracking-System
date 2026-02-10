import { useState } from "react";

import API from "../services/api";

const TenantComplaintCard = ({ complaint, setNotice }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await API.delete(`/complaints/${complaint._id}`);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      setNotice({
        message: error.response.data.message,
        tone: "critical",
      });
    }

    setIsDeleting(false);
  };

  return (
    <div className="card">
      <h3>{complaint.title}</h3>
      <p>{complaint.description}</p>
      <p>Status: {complaint.status}</p>
      <p>Created at: {new Date(complaint.createdAt).toLocaleString()}</p>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default TenantComplaintCard;
