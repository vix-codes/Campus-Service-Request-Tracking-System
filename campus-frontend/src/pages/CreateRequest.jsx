import { useState } from "react";
import API from "../services/api";

function CreateRequest(){

  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [image,setImage]=useState("");
  const [imagePreview,setImagePreview]=useState(null);
  const [loading,setLoading]=useState(false);

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImage(url);
    if(url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const submit=async(e)=>{
    e.preventDefault();
    
    if(!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    setLoading(true);
    try{
      await API.post("/requests",{
        title,
        description,
        image
      });

      alert("✅ Request created successfully with evidence!");
      setTitle("");
      setDescription("");
      setImage("");
      setImagePreview(null);
      window.location.reload();

    }catch(err){
      alert("❌ Error creating request: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return(
    <div style={{backgroundColor:"#f9f9f9",padding:20,borderRadius:8,marginBottom:20}}>
      <h3>🔧 Create New Service Request</h3>
      
      <form onSubmit={submit}>
        <div style={{marginBottom:15}}>
          <label><strong>Title *</strong></label><br/>
          <input 
            placeholder="e.g., Broken Door Lock, Network Issue"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            style={{width:"100%",padding:"10px",marginTop:"5px",border:"1px solid #ccc",borderRadius:"4px"}}
            required
          />
        </div>

        <div style={{marginBottom:15}}>
          <label><strong>Description *</strong></label><br/>
          <textarea 
            placeholder="Describe the problem in detail..."
            value={description}
            onChange={e=>setDescription(e.target.value)}
            style={{width:"100%",padding:"10px",marginTop:"5px",border:"1px solid #ccc",borderRadius:"4px",minHeight:"100px"}}
            required
          />
        </div>

        <div style={{marginBottom:15}}>
          <label><strong>📸 Evidence/Image URL (optional)</strong></label><br/>
          <p style={{fontSize:"0.85em",color:"#666"}}>Paste the URL of a photo showing the problem (e.g., from Imgur, cloud storage)</p>
          <input 
            placeholder="https://example.com/image.jpg"
            value={image}
            onChange={handleImageChange}
            style={{width:"100%",padding:"10px",marginTop:"5px",border:"1px solid #ccc",borderRadius:"4px"}}
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div style={{marginBottom:15,padding:10,backgroundColor:"white",border:"2px solid #0066cc",borderRadius:4}}>
            <p><strong>Image Preview:</strong></p>
            <img 
              src={imagePreview} 
              alt="Preview" 
              width="200" 
              style={{borderRadius:4,maxHeight:300,objectFit:"cover"}}
              onError={(e) => {
                e.target.style.display = "none";
                alert("⚠️ Could not load image. Check URL.");
              }}
            />
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          style={{
            padding:"12px 20px",
            backgroundColor:"#0066cc",
            color:"white",
            border:"none",
            borderRadius:"4px",
            cursor:loading?"not-allowed":"pointer",
            fontSize:"1em",
            fontWeight:"bold",
            opacity:loading?0.6:1
          }}
        >
          {loading ? "Creating..." : "📤 Create Request"}
        </button>
      </form>
    </div>
  );
}

export default CreateRequest;
