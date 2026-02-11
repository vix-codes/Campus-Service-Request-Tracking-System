
import { useState } from "react";
import API from "../services/api";

const CreateComplaintForm = ({ onComplaintCreated, setNotice }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [busy, setBusy] = useState(false);

  const clearImage = () => {
    setImageUrl("");
    setImageDataUrl("");
    setFileInputKey((prev) => prev + 1);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice?.({ tone: "error", message: "Please select an image file." });
      event.target.value = "";
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setNotice?.({ tone: "error", message: "Image must be smaller than 6MB." });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(String(reader.result || ""));
      setImageUrl("");
    };
    reader.onerror = () => {
      setNotice?.({ tone: "error", message: "Unable to read selected image." });
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const createComplaint = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await API.post("/complaints", {
        title,
        description,
        image: imageDataUrl || imageUrl.trim(),
      });

      setNotice({ tone: "success", message: "Complaint created successfully." });
      setTitle("");
      setDescription("");
      clearImage();
      onComplaintCreated?.();
    } catch (error) {
      setNotice({
        tone: "error",
        message: error.response?.data?.message || "Error creating complaint.",
      });
    } finally {
      setBusy(false);
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
          Upload Image (optional)
          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={busy}
          />
        </label>

        {imageDataUrl && (
          <div className="form__label">
            <span>Preview</span>
            <img className="card__image" src={imageDataUrl} alt="Complaint preview" />
            <button type="button" className="button button--ghost" onClick={clearImage}>
              Remove image
            </button>
          </div>
        )}

        <label className="form__label">
          Or Image URL (optional)
          <input
            placeholder="https://"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={busy || Boolean(imageDataUrl)}
          />
        </label>

        <button className="button button--primary" type="submit" disabled={busy}>
          {busy ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default CreateComplaintForm;
