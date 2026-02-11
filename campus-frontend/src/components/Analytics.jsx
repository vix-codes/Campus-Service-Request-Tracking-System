import IconButton from "./IconButton";
import { RefreshIcon } from "./icons";

const msToHours = (ms) => {
  if (!ms || Number.isNaN(Number(ms))) return "0";
  return (Number(ms) / (1000 * 60 * 60)).toFixed(1);
};

const Analytics = ({ analytics, loading, onRefresh }) => {
  const overview = analytics?.overview;
  const priority = analytics?.priority;
  const time = analytics?.time;
  const technicians = analytics?.technicians;

  return (
    <div className="card">
      <div className="card__header">
        <h3>Analytics</h3>
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          title={loading ? "Refreshing..." : "Refresh analytics"}
        >
          <RefreshIcon className={loading ? "spin" : ""} />
        </IconButton>
      </div>

      <div className="analytics">
        <div className="analytic-item">
          <h4 className="analytic-item__title">Total</h4>
          <p className="analytic-item__value">{overview?.totalComplaints ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">New</h4>
          <p className="analytic-item__value">{overview?.open ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Assigned</h4>
          <p className="analytic-item__value">{overview?.assigned ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">In Progress</h4>
          <p className="analytic-item__value">{overview?.inProgress ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Completed</h4>
          <p className="analytic-item__value">{overview?.completed ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Closed</h4>
          <p className="analytic-item__value">{overview?.closed ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Rejected</h4>
          <p className="analytic-item__value">{overview?.rejected ?? "-"}</p>
        </div>
      </div>

      <div className="analytics">
        <div className="analytic-item">
          <h4 className="analytic-item__title">Critical</h4>
          <p className="analytic-item__value">{priority?.critical ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">High</h4>
          <p className="analytic-item__value">{priority?.high ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Avg Resolution (hrs)</h4>
          <p className="analytic-item__value">{msToHours(time?.avgResolutionMs)}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Created Today</h4>
          <p className="analytic-item__value">{time?.todayCreated ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Closed Today</h4>
          <p className="analytic-item__value">{time?.todayClosed ?? "-"}</p>
        </div>
        <div className="analytic-item">
          <h4 className="analytic-item__title">Technicians</h4>
          <p className="analytic-item__value">{technicians?.total ?? "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
  
