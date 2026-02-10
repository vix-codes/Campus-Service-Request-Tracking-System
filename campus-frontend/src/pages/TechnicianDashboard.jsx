import { useEffect, useState } from "react";

import API from "../services/api";

import TechnicianComplaintCard from "../components/TechnicianComplaintCard";

const TechnicianDashboard = ({ user }) => {
    const [complaints, setComplaints] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      document.body.classList.toggle("dark");
    };
  
    useEffect(() => {
      const fetchComplaints = async () => {
        const { data } = await API.get("/complaints");
  
        setComplaints(data);
      };
  
      fetchComplaints();
    }, []);

    return (
        <div className={`app-layout ${isDarkMode ? 'dark' : ''}`}>
            <aside className="sidebar">
                <div className="sidebar__logo">Logo</div>
                <nav className="sidebar__nav">
                    <ul>
                        <li className="active">Dashboard</li>
                        <li>Requests</li>
                        <li>Settings</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <header className="top-bar">
                    <div>Good evening, {user?.name}</div>
                    <input type="search" placeholder="Search..." />
                    <div className="top-bar__actions">
                        <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
                        <div className="profile-circle"></div>
                    </div>
                </header>
                <div className="card-grid">
                  {complaints.map((complaint) => (
                      <TechnicianComplaintCard key={complaint._id} complaint={complaint} />
                  ))}
                </div>
            </main>
        </div>
      );
  };
  
  export default TechnicianDashboard;
