function NoticeBanner({ message, tone = "info", onClose }) {
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
