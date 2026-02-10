
import { useState } from "react";
import API from "../services/api";
import NoticeBanner from "../components/NoticeBanner";

// A more robust error parsing function
const getErrorMessage = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return "No response from server. Please check your network connection.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const isLoading = status === "loading";

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setNotice(null);

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, role, name, userId } = response.data;

      // Store user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "tenant");
      localStorage.setItem("userName", name || "");
      localStorage.setItem("userId", userId || "");

      setStatus("success");
      setNotice({
        tone: "success",
        message: "Login successful! Redirecting...",
      });

      // Reload the page to trigger redirection which is handled in App.jsx
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error("Login failed:", err); // Keep detailed log for developers
      setStatus("error");
      setNotice({
        tone: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="page page--center">
      <div className="card card--narrow">
        <div className="card__header">
          <h2>Welcome Back!</h2>
        </div>
        <p className="muted">
          Sign in to manage your maintenance requests.
        </p>
        
        {notice && (
          <NoticeBanner
            message={notice.message}
            tone={notice.tone}
            onClose={() => setNotice(null)}
          />
        )}

        <form onSubmit={handleLogin} className="form">
          <label className="form__label">
            Email
            <input
              type="email"
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </label>

          <label className="form__label">
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </label>

          <button
            className="button button--primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
