import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import API from "./services/api";

import Notice from "./components/Notice";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TenantDashboard from "./pages/TenantDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import "./styles/theme.css";
import "./styles/card.css";
import "./styles/layout.css";
import "./styles/button.css";
import "./styles/login.css";

const App = () => {
  const [notice, setNotice] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/users/me");

        if (response.status === 200) {
          setUser(response.data);
        } else {
          throw new Error();
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {notice && (
        <Notice
          message={notice.message}
          tone={notice.tone}
          onDismiss={() => setNotice(null)}
        />
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setUser={setUser} setNotice={setNotice} />}
          />
          <Route path="/register" element={<Register setNotice={setNotice} />} />

          <Route
            path="/tenant/dashboard"
            element={<TenantDashboard user={user} setNotice={setNotice} />}
          />
          <Route
            path="/technician/dashboard"
            element={<TechnicianDashboard user={user} setNotice={setNotice} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
