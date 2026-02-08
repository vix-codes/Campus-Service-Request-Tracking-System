import { useEffect, useState } from "react";
import API from "../services/api";

function NotificationBell(){
  const [notifications,setNotifications] = useState([]);
  const [open,setOpen] = useState(false);

  const fetch = async ()=>{
    try{
      const res = await API.get('/notifications');
      setNotifications(res.data.data || []);
    }catch(err){
      console.error('fetch notifications', err);
    }
  };

  useEffect(()=>{ fetch(); },[]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = async (id)=>{
    try{
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n=> n._id===id?{...n,read:true}:n));
    }catch(err){
      console.error('mark read', err);
    }
  };

  return (
    <div style={{position:'relative',marginLeft:12}}>
      <button onClick={()=>{setOpen(!open); if(!open) fetch();}} style={{position:'relative',background:'transparent',border:'none',cursor:'pointer'}}>
        <span style={{fontSize:20}}>🔔</span>
        {unreadCount>0 && (
          <span style={{position:'absolute',top:-6,right:-6,background:'#cc0000',color:'white',borderRadius:12,padding:'2px 6px',fontSize:12}}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{position:'absolute',right:0,top:30,width:360,maxHeight:360,overflowY:'auto',background:'white',border:'1px solid #ddd',boxShadow:'0 6px 18px rgba(0,0,0,0.08)',borderRadius:6,zIndex:40}}>
          <div style={{padding:10,borderBottom:'1px solid #eee',fontWeight:'bold'}}>Notifications</div>
          {notifications.length===0 && <div style={{padding:12,color:'#666'}}>No notifications</div>}
          {notifications.map(n=> (
            <div key={n._id} style={{padding:10,borderBottom:'1px solid #f1f1f1',background:n.read? 'white':'#f7fbff'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{fontWeight:700}}>{n.type?.toUpperCase() || 'INFO'}</div>
                <div style={{fontSize:12,color:'#999'}}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div style={{marginTop:6,fontSize:14}}>{n.message}</div>
              <div style={{marginTop:8}}>
                {!n.read && <button onClick={()=>markRead(n._id)} style={{padding:'6px 10px',background:'#0066cc',color:'white',border:'none',borderRadius:4,cursor:'pointer'}}>Mark read</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
