import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

const Login = ({ setUser, setNotice }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        setUser(response.data.user);

        if (response.data.user.role === "tenant") {
          navigate("/tenant/dashboard");
        } else if (response.data.user.role === "technician") {
          navigate("/technician/dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error();
      }
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
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
