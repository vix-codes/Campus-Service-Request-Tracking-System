import { useState } from "react";
import API from "../services/api";

function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (err) {
      return null;
    }
  };

  const login = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await API.post("/auth/login",{email,password});

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("role",res.data.role);

      // prefer explicit userId from response, otherwise decode token
      if (res.data.userId) {
        localStorage.setItem("userId", res.data.userId);
      } else {
        const decoded = decodeToken(res.data.token);
        if (decoded?.id) {
          localStorage.setItem("userId", decoded.id);
          localStorage.setItem("email", decoded.email);
        }
      }

      if (res.data.name) {
        localStorage.setItem("name", res.data.name);
      }

      window.location.reload();
    }catch(err){
      alert("❌ Login failed: " + (err.response?.data?.message || "Invalid credentials"));
      setLoading(false);
    }
  };

  return(
    <div style={{padding:40,maxWidth:400,margin:"100px auto"}}>
      <div style={{backgroundColor:"white",padding:30,borderRadius:8,boxShadow:"0 4px 6px rgba(0,0,0,0.1)"}}>
        <h2 style={{textAlign:"center",marginBottom:30,color:"#0066cc"}}>🏛️ Campus Service</h2>
        <h3 style={{textAlign:"center",marginBottom:30}}>Request Tracking System</h3>

        <form onSubmit={login}>
          <div style={{marginBottom:20}}>
            <label><strong>Email</strong></label>
            <input 
              placeholder="your@email.com"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              type="email"
              required
              style={{width:"100%",padding:"10px",marginTop:"8px",border:"1px solid #ccc",borderRadius:"4px",boxSizing:"border-box"}}
            />
          </div>

          <div style={{marginBottom:20}}>
            <label><strong>Password</strong></label>
            <input 
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
              style={{width:"100%",padding:"10px",marginTop:"8px",border:"1px solid #ccc",borderRadius:"4px",boxSizing:"border-box"}}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              width:"100%",
              padding:"12px",
              backgroundColor:"#0066cc",
              color:"white",
              border:"none",
              borderRadius:"4px",
              fontSize:"1em",
              fontWeight:"bold",
              cursor:loading?"not-allowed":"pointer",
              opacity:loading?0.6:1
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{marginTop:30,padding:15,backgroundColor:"#f0f4c3",borderRadius:4}}>
          <p style={{fontSize:"0.9em",margin:"5px 0"}}><strong>Demo Credentials:</strong></p>
          <p style={{fontSize:"0.85em",margin:"5px 0"}}>👨‍🎓 Student: student@example.com / password</p>
          <p style={{fontSize:"0.85em",margin:"5px 0"}}>🔧 Staff: staff@example.com / password</p>
          <p style={{fontSize:"0.85em",margin:"5px 0"}}>👨‍💼 Admin: admin@example.com / password</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
