const ComplaintCard = ({
    complaint,
    users,
    onAssign,
    onPriorityChange,
    onDelete,
  }) => {
    return (
      <div className="card">
        <div className="card__header">
          <div>
            <h4>{complaint.title}</h4>
            <p className="muted">{complaint.description}</p>
          </div>
          <span
            className={`status status--${complaint.status
              ?.toLowerCase()
              .replaceAll("_", "-")}`}
          >
            {complaint.status?.replaceAll("_", " ")}
          </span>
        </div>
  
        {complaint.image && (
          <img
            className="card__image"
            src={complaint.image}
            alt={`${complaint.title} evidence`}
          />
        )}
  
        <div className="card__meta">
          {complaint.token && <p>Token: {complaint.token}</p>}
          {complaint.priority && <p>Priority: {complaint.priority}</p>}
          {complaint.createdAt && (
            <p>Created: {new Date(complaint.createdAt).toLocaleString()}</p>
          )}
          {complaint.createdBy && <p>By: {complaint.createdBy.name}</p>}
        </div>
  
        <div className="card__actions">
          <select
            className="input"
            onChange={(e) => onAssign(complaint._id, e.target.value)}
            value={complaint.assignedTo?._id || ""}
          >
            <option value="" disabled>
              Assign to
            </option>
            {users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
  
          <select
            className="input"
            onChange={(e) => onPriorityChange(complaint._id, e.target.value)}
            value={complaint.priority || ""}
          >
            <option value="" disabled>
              Set priority
            </option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
  
          <button
            className="button button--danger"
            onClick={() => onDelete(complaint._id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };
  
  export default ComplaintCard;
  