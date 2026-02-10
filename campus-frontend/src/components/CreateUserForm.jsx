import { useState } from "react";
import API from "../services/api";

const CreateUserForm = ({ onUserCreated, setNotice }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("technician");

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      setNotice({ tone: "success", message: "User created successfully" });
      setName("");
      setEmail("");
      setPassword("");
      onUserCreated();
    } catch (err) {
      if (err.response?.data?.message) {
        setNotice({ tone: "error", message: err.response.data.message });
      } else {
        setNotice({ tone: "error", message: "Unable to create user." });
      }
    }
  };

  return (
    <form onSubmit={createUser} className="form">
      <label className="form__label">
        Name
        <input
          placeholder="e.g., John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="form__label">
        Email
        <input
          placeholder="e.g., john.doe@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="form__label">
        Password
        <input
          placeholder="Enter a secure password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <label className="form__label">
        Role
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="technician">Technician</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <button className="button button--primary" type="submit">
        Create
      </button>
    </form>
  );
};

export default CreateUserForm;
