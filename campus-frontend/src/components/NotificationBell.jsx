
import { useEffect, useState } from "react";
import API from "../services/api";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("mark read", err);
    }
  };

  return { notifications, loading, refetch: fetchNotifications, markRead };
};

const typeLabels = {
  COMPLAINT_ASSIGNED: "Assigned",
  COMPLAINT_COMPLETED: "Completed",
  COMPLAINT_CLOSED: "Closed",
  COMPLAINT_REJECTED: "Rejected",
  COMPLAINT_CREATED: "Created",
};

function NotificationBell() {
  const { notifications, loading, refetch, markRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification">
      <button
        className="notification__button"
        onClick={() => {
          setOpen(!open);
          if (!open) refetch();
        }}
        type="button"
      >
        <span aria-hidden>Alerts</span>
        {unreadCount > 0 && (
          <span className="notification__badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification__panel">
          <div className="notification__header">
            <div className="notification__title">Notifications</div>
            <button className="button button--ghost" onClick={refetch} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {loading && notifications.length === 0 && (
            <div className="notification__empty">Loading notifications...</div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="notification__empty">No notifications</div>
          )}
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notification__item ${
                n.isRead ? "" : "notification__item--unread"
              }`}
            >
              <div className="notification__item-header">
                <div className="notification__type">
                  {typeLabels[n.type] || n.type?.replaceAll("_", " ") || "Info"}
                </div>
                <div className="notification__time">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="notification__message">
                {n.message}
                {n.relatedToken ? ` (${n.relatedToken})` : ""}
              </div>
              <div className="notification__actions">
                {!n.isRead && (
                  <button
                    className="button button--primary button--small"
                    onClick={() => markRead(n._id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
