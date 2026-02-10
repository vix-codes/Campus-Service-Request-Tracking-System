const Analytics = ({ role, analytics, loading, onRefresh }) => {
    return (
      <div className="card">
        <div className="card__header">
          <h3>Analytics</h3>
          <button
            className="button button--ghost"
            type="button"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
  
        {role === "admin" && (
          <div className="analytics">
            <div className="analytic-item">
              <h4 className="analytic-item__title">Total Users</h4>
              <p className="analytic-item__value">{analytics?.totalUsers}</p>
            </div>
            <div className="analytic-item">
              <h4 className="analytic-item__title">Total Tenants</h4>
              <p className="analytic-item__value">{analytics?.totalTenants}</p>
            </div>
            <div className="analytic-item">
              <h4 className="analytic-item__title">Total Technicians</h4>
              <p className="analytic-item__value">{analytics?.totalTechnicians}</p>
            </div>
            <div className="analytic-item">
              <h4 className="analytic-item__title">Total Managers</h4>
              <p className="analytic-item__value">{analytics?.totalManagers}</p>
            </div>
          </div>
        )}
  
        <div className="analytics">
          <div className="analytic-item">
            <h4 className="analytic-item__title">Total Complaints</h4>
            <p className="analytic-item__value">{analytics?.totalComplaints}</p>
          </div>
          <div className="analytic-item">
            <h4 className="analytic-item__title">New Complaints</h4>
            <p className="analytic-item__value">{analytics?.newComplaints}</p>
          </div>
          <div className="analytic-item">
            <h4 className="analytic-item__title">In Progress</h4>
            <p className="analytic-item__value">{analytics?.inProgressComplaints}</p>
          </div>
          <div className="analytic-item">
            <h4 className="analytic-item__title">Completed</h4>
            <p className="analytic-item__value">{analytics?.resolvedComplaints}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Analytics;
  