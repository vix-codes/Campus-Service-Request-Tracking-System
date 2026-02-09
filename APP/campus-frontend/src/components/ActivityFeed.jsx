import { useEffect, useState } from "react";
import API from "../services/api";

function ActivityFeed() {
  const [logs, setLogs] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "admin" || role === "manager") {
      fetchLogs();
    }
  }, [role]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/audit");
      setLogs(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (role !== "admin" && role !== "manager") {
    return null;
  }

  return (
    <div className="section">
      <h3>System Activity Timeline</h3>

      {logs.length === 0 && <p className="muted">No activity yet</p>}

      <div className="timeline">
        {logs.map((log) => (
          <div
            key={log._id}
            className="timeline__item"
          >
            <div className="timeline__title">{log.action.replaceAll("_"," ")}</div>
            {log.performedBy && (
              <div className="timeline__meta">
                {log.performedBy.name} ({log.performedByRole})
              </div>
            )}
            {log.note && <div className="timeline__note">{log.note}</div>}
            <div className="timeline__time">
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
