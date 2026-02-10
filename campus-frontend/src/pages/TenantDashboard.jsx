import { useEffect, useState } from "react";
import CreateComplaintForm from "../components/CreateComplaintForm";
import TenantComplaintCard from "../components/TenantComplaintCard";

const TenantDashboard = ({ user, setNotice }) => {
  const [complaints, setComplaints] = useState([]);
  const [showCreateComplaintForm, setShowCreateComplaintForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : ''}`}>
        <aside className="sidebar">
            <div className="sidebar__logo">Logo</div>
            <nav className="sidebar__nav">
                <ul>
                    <li className="active">Dashboard</li>
                    <li>Residents</li>
                    <li>Payments</li>
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
                <div className="card">Total residents</div>
                <div className="card">Pending requests</div>
                <div className="card">Monthly collection</div>
                <div className="card">Empty rooms</div>
            </div>
        </main>
    </div>
  );
};

export default TenantDashboard;
