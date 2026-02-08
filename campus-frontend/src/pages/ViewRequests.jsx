import {useEffect,useState} from "react";
import API from "../services/api";

function ViewRequests(){

  const [data,setData]=useState([]);

  useEffect(()=>{
    fetch();
  },[]);

  const fetch=async()=>{
    const res = await API.get("/requests");
    const requests = res.data.data || [];

    // fetch activity logs for user's requests in parallel
    const userId = localStorage.getItem("userId");
    const myRequests = requests.filter(r => r.createdBy._id === userId);

    const withLogs = await Promise.all(
      myRequests.map(async (r) => {
        try {
          const logRes = await API.get(`/audit/request/${r._id}`);
          r.activityLogs = logRes.data.data || [];
        } catch (err) {
          r.activityLogs = [];
        }
        return r;
      })
    );

    setData(withLogs);
  };

  return(
    <div>
      <h2>📋 My Service Requests</h2>
      <p style={{color:"#0066cc",fontStyle:"italic",marginBottom:20}}>
        Every request has full lifecycle traceability.
      </p>

      {data.filter(r => r.createdBy._id === localStorage.getItem("userId")).length === 0 && (
        <p style={{color:"#999"}}>No requests yet. Create your first service request above.</p>
      )}

      {data.filter(r => r.createdBy._id === localStorage.getItem("userId")).map(r=>(
        <div key={r._id}
        style={{border:"2px solid #333",margin:15,padding:15,borderRadius:8,backgroundColor:"#f9f9f9"}}>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div style={{flex:1}}>
              <h3>{r.title}</h3>
              <p><strong>Description:</strong> {r.description}</p>
              <p><strong>Current Status:</strong> <span style={{
                color: r.status === "Closed" ? "green" : r.status === "Rejected" ? "red" : "blue", 
                fontWeight:"bold",
                padding:"4px 8px",
                backgroundColor:"#f0f0f0",
                borderRadius:"4px"
              }}>{r.status}</span></p>

              {r.assignedTo &&
                <p><strong>Assigned to:</strong> {r.assignedTo.name}</p>
              }

              {r.rejectReason &&
                <p style={{color:"red",backgroundColor:"#ffe6e6",padding:"8px",borderRadius:"4px"}}>
                  <strong>⚠️ Rejection Reason:</strong> {r.rejectReason}
                </p>
              }

              <p style={{fontSize:"0.9em",color:"#666"}}>
                <strong>Created:</strong> {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>

            {/* IMAGE EVIDENCE */}
            {r.image && (
              <div style={{marginLeft:20,textAlign:"center",flex:"0 0 auto"}}>
                <p><strong>📸 Evidence Photo</strong></p>
                <img 
                  src={r.image} 
                  width="180" 
                  style={{borderRadius:6,border:"2px solid #0066cc",maxHeight:200,objectFit:"cover"}}
                  alt="Evidence"
                />
                <p style={{fontSize:"0.8em",color:"#666",marginTop:8}}>
                  Uploaded: {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* LIFECYCLE TIMELINE */}
          <div style={{marginTop:15,padding:10,backgroundColor:"#f0f0f0",borderRadius:5}}>
            <h4>📋 Complete Lifecycle Timeline:</h4>
            {r.statusHistory && r.statusHistory.length > 0 ? (
              <div style={{paddingLeft:10}}>
                {r.statusHistory.map((history, idx) => (
                  <div key={idx} style={{marginBottom:10,paddingLeft:10,borderLeft:"3px solid #0066cc"}}>
                    <p style={{margin:"5px 0"}}>
                      <strong style={{color:"#0066cc"}}>{history.status}</strong>
                    </p>
                    <p style={{margin:"5px 0",fontSize:"0.9em",color:"#666"}}>
                      By: {history.changedBy?.name || "System"} ({history.changedBy?.email || "N/A"})
                    </p>
                    <p style={{margin:"5px 0",fontSize:"0.9em",color:"#666"}}>
                      {new Date(history.changedAt).toLocaleString()}
                    </p>
                    {history.notes && (
                      <p style={{margin:"5px 0",fontSize:"0.9em",fontStyle:"italic"}}>
                        📝 {history.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No status history available</p>
            )}
          </div>

          {/* ACTIVITY PANEL */}
          <div style={{marginTop:12,padding:10,backgroundColor:"#ffffff",border:"1px solid #e0e0e0",borderRadius:6}}>
            <h4>🔎 Activity</h4>
            {r.activityLogs && r.activityLogs.length > 0 ? (
              <ul style={{paddingLeft:18}}>
                {r.activityLogs.map((log, i) => (
                  <li key={i} style={{marginBottom:8}}>
                    <strong>{log.userName || log.userId?.name || 'System'}</strong>
                    <span style={{color:'#666',marginLeft:8}}>• {log.action}</span>
                    <div style={{fontSize:'0.9em',color:'#444',marginTop:4}}>{log.details}</div>
                    <div style={{fontSize:'0.8em',color:'#999'}}>{new Date(log.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{color:'#999'}}>No activity recorded for this request.</p>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}

export default ViewRequests;
