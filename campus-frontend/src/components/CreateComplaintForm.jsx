
import { useState } from "react";
import API from "../services/api";

const CreateComplaintForm = ({ onComplaintCreated, setNotice }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const createComplaint = async (e) => {
    e.preventDefault();

    try {
      await API.post("/complaints", {
        title,
        description,
        image,
      });

      setNotice({ tone: "success", message: "Complaint created successfully." });
      setTitle("");
      setDescription("");
      setImage("");
      onComplaintCreated();
    } catch {
      setNotice({ tone: "error", message: "Error creating complaint." });
    }
  };

  return (
    <div className="card">
      <h3>Create Complaint</h3>

      <form onSubmit={createComplaint} className="form">
        <label className="form__label">
          Title
          <input
            placeholder="e.g., Broken door lock"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="form__label">
          Description
          <textarea
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="form__label">
          Image URL (optional)
          <input
            placeholder="https://"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        <button className="button button--primary" type="submit">
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default CreateComplaintForm;
