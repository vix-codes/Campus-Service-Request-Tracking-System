
import { useEffect } from "react";

function NoticeBanner({ message, tone = "info", onClose }) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notice notice--${tone}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" className="notice__close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
}

export default NoticeBanner;
