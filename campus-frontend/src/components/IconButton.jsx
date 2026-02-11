const IconButton = ({
  onClick,
  disabled = false,
  title,
  children,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`icon-button ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
};

export default IconButton;
