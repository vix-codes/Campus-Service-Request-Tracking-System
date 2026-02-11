import { useEffect } from "react";

function NoticeBanner({ message, tone = "info", onClose }) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notice notice--${tone}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" className="notice__close" onClick={onClose}>
          x
        </button>
      )}
    </div>
  );
}

export default NoticeBanner;
