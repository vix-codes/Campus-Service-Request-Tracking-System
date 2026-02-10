import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

const Register = ({ setNotice }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users/register", {
        name,
        email,
        password,
        role,
      });

      setNotice({
        message: "You have successfully registered. Please log in.",
        tone: "positive",
      });

      navigate("/login");
    } catch (error) {
      setNotice({
        message: error.response.data.message,
        tone: "critical",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="tenant">Tenant</option>
            <option value="technician">Technician</option>
          </select>
          <button type="submit" className="button">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
