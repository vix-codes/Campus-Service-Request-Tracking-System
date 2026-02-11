
import { useEffect, useState } from "react";
import API from "../services/api";
import IconButton from "./IconButton";
import { RefreshIcon } from "./icons";

// A hook to fetch and manage the activity feed
const useActivityFeed = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/audit");
      setLogs(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin" || role === "manager") {
      fetchLogs();
    }
  }, [role]);

  return { logs, loading, refetch: fetchLogs };
};

// The component to display the activity feed
function ActivityFeed() {
  const { logs, loading, refetch } = useActivityFeed();
  const role = localStorage.getItem("role");

  if (role !== "admin" && role !== "manager") {
    return null;
  }

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3>System Activity Timeline</h3>
        <IconButton
          onClick={refetch}
          disabled={loading}
          title={loading ? "Refreshing..." : "Refresh activity"}
        >
          <RefreshIcon className={loading ? "spin" : ""} />
        </IconButton>
      </div>

      {loading && logs.length === 0 && <p className="muted">Loading activity...</p>}
      {!loading && logs.length === 0 && <p className="muted">No activity yet</p>}

      <div className="timeline">
        {logs.map((log) => (
          <div key={log._id} className="timeline__item">
            <div className="timeline__title">{log.action.replaceAll("_", " ")}</div>
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
