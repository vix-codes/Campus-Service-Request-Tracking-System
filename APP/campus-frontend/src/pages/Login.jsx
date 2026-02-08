import { useState } from "react";
import API from "../services/api";
import NoticeBanner from "../components/NoticeBanner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(null);

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, role, name, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role ?? "student");
      if (name) localStorage.setItem("userName", name);
      if (userId) localStorage.setItem("userId", userId);

      setNotice({ tone: "success", message: "Login successful. Redirecting..." });
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      console.log(err);
      setNotice({ tone: "error", message: "Login failed. Check your credentials." });
    }
  };

  return (
    <div className="page page--center">
      <div className="card card--narrow">
        <h2>Campus Service Login</h2>
        <p className="muted">Use your campus email to sign in.</p>
        <NoticeBanner
          message={notice?.message}
          tone={notice?.tone}
          onClose={() => setNotice(null)}
        />

        <form onSubmit={login} className="form">
          <label className="form__label">
            Email
            <input
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </label>

          <button className="button button--primary" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
