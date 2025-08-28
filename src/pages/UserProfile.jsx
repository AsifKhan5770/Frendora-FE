import { useEffect, useState, useRef } from "react";
import { authenticatedFetch } from "../utils/api";

let Profile = () => {
  let [user, setUser] = useState(null);
  let [isEditing, setIsEditing] = useState(false);
  let [editData, setEditData] = useState({
    name: "",
    oldPassword: "",
    newPassword: ""
  });
  let [message, setMessage] = useState("");
  let [avatarPreview, setAvatarPreview] = useState("");
  let [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const openFilePicker = () => fileInputRef.current && fileInputRef.current.click();

  let stored = JSON.parse(localStorage.getItem("user"));
  let userId = stored?.id || stored?._id;

  // Fetch profile
  useEffect(() => {
    let fetchProfile = async () => {
      try {
        let res = await authenticatedFetch(
          `http://localhost:3001/api/users/profile/${userId}`
        );
        if (res.ok) {
          let data = await res.json();
          setUser(data);
          setEditData({
            name: data.name,
            oldPassword: "",
            newPassword: ""
          });
        } else {
          setMessage("Failed to fetch profile");
        }
      } catch (error) {
        setMessage("Error fetching profile");
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  // Handle edit mode toggle
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      setEditData({
        name: user.name,
        oldPassword: "",
        newPassword: ""
      });
      setAvatarPreview("");
      setSelectedFile(null);
    }
    setIsEditing(!isEditing);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    console.log("File selection triggered", e.target.files);
    const file = e.target.files?.[0] || null;
    if (!file) {
      console.log("No file selected");
      setSelectedFile(null);
      setAvatarPreview("");
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setMessage("Only JPG, PNG, WEBP, GIF images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > maxSizeBytes) {
      setMessage("Image is too large. Max 5MB");
      e.target.value = "";
      return;
    }

    setMessage("");
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      console.log("FileReader onload triggered, result length:", reader.result.length);
      setAvatarPreview(reader.result);
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
    };
    reader.readAsDataURL(file);
  };

  // Save all changes
  const handleSave = async () => {
    try {
      setMessage("Saving changes...");
      
      // Update name if changed
      if (editData.name !== user.name) {
        let res = await authenticatedFetch(
          `http://localhost:3001/api/users/profile/${userId}/name`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editData.name }),
          }
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to update name");
        }
      }

      // Update password if provided
      if (editData.oldPassword && editData.newPassword) {
        let res = await authenticatedFetch(
          `http://localhost:3001/api/users/profile/${userId}/password`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              oldPassword: editData.oldPassword, 
              newPassword: editData.newPassword 
            }),
          }
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to update password");
        }
      }

      // Upload avatar if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        let res = await authenticatedFetch(
          `http://localhost:3001/api/users/profile/${userId}/avatar`,
          {
            method: "POST",
            body: formData,
            headers: {},
          }
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to upload avatar");
        }
      }

      // Refresh profile data
      let res = await authenticatedFetch(
        `http://localhost:3001/api/users/profile/${userId}`
      );
      if (res.ok) {
        let data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        
        // Notify navbar to refresh (for avatar updates)
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: data }));
        
        // Reset form and exit edit mode
        setEditData({
          name: data.name,
          oldPassword: "",
          newPassword: ""
        });
        setAvatarPreview("");
        setSelectedFile(null);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("Failed to refresh profile");
      }
      
    } catch (error) {
      setMessage(error.message || "Error updating profile");
    }
  };

  // Delete avatar
  const handleAvatarDelete = async () => {
    try {
      let res = await authenticatedFetch(
        `http://localhost:3001/api/users/profile/${userId}/avatar`,
        { method: "DELETE" }
      );
      let data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Notify navbar to refresh (for avatar updates)
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: data.user }));
        
        setMessage("Avatar deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Error deleting avatar");
      }
    } catch (error) {
      setMessage("Error deleting avatar");
    }
  };

  if (!user) return <h2 className="text-center mt-5">Loading profile...</h2>;

  // Determine what to show for avatar
  const avatarToShow = avatarPreview || (user.avatarUrl ? `http://localhost:3001/uploads/${user.avatarUrl}` : '/placeholder.png');

  return (
    <div className="container mt-5 pt-5 d-flex justify-content-center align-item-center">
      <style>
        {`
          .avatar-hover:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          .avatar-hover:hover .avatar-edit-overlay {
            opacity: 1 !important;
          }
        `}
      </style>
      <div className="row justify-content-center w-100" style={{maxWidth: 720}}>
        <div className="col-12">
          <div className="card shadow-lg p-4">
                         <div className="position-relative mb-4">
               <h2 className="mb-0 text-center">👤 My Profile</h2>
               <div 
                 className="position-absolute top-0 end-0"
                 style={{ cursor: 'pointer' }}
                 onClick={toggleEditMode}
                 title={isEditing ? 'Cancel' : 'Edit Profile'}
               >
                 {isEditing ? '✕' : '✏️'}
               </div>
             </div>

            {/* Profile Info */}
            <div className="mb-4">
              <div className="mb-3 d-flex justify-content-center align-items-center">
                 <div
                   onClick={isEditing ? openFilePicker : undefined}
                   style={{ 
                     width: 150, 
                     height: 150, 
                     borderRadius: '50%', 
                     marginRight: 16, 
                     position: 'relative', 
                     cursor: isEditing ? 'pointer' : 'default',
                     border: isEditing ? '3px solid #0d6efd' : '3px solid #e9ecef',
                     transition: 'all 0.2s ease'
                   }}
                   className={isEditing ? 'avatar-hover' : ''}
                 >
                   {avatarToShow && avatarToShow !== '/placeholder.png' ? (
                     <img
                       src={avatarToShow}
                       alt="avatar"
                       style={{ 
                         width: '100%', 
                         height: '100%', 
                         borderRadius: '50%', 
                         objectFit: 'contain',
                         backgroundColor: '#f8f9fa'
                       }}
                       onError={(e) => {
                         e.target.style.display = 'none';
                         e.target.nextSibling.style.display = 'flex';
                       }}
                     />
                   ) : (
                     <div
                       className="d-flex align-items-center justify-content-center"
                       style={{ 
                         width: '100%', 
                         height: '100%', 
                         borderRadius: '50%', 
                         backgroundColor: '#f8f9fa', 
                         color: '#6c757d', 
                         fontWeight: 600, 
                         fontSize: 20
                       }}
                     >
                       {((user.name || user.email || '?')
                         .split(' ')
                         .map(w => w[0])
                         .join('')
                         .slice(0, 2)
                       ).toUpperCase()}
                     </div>
                   )}
                   
                   {/* Edit overlay */}
                   {isEditing && (
                     <div
                       style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         bottom: 0,
                         background: 'rgba(13, 110, 253, 0.8)',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: '12px',
                         fontWeight: 'bold',
                         borderRadius: '50%',
                         opacity: 0,
                         transition: 'opacity 0.2s ease'
                       }}
                       className="avatar-edit-overlay"
                     >
                       {avatarToShow && avatarToShow !== '/placeholder.png' ? 'Change' : 'Add'}
                     </div>
                   )}
                   
                   {/* Remove indicator for existing avatar */}
                   {isEditing && avatarToShow && avatarToShow !== '/placeholder.png' && (
                     <div
                       style={{
                         position: 'absolute',
                         top: -8,
                         right: -8,
                         background: '#dc3545',
                         color: 'white',
                         borderRadius: '50%',
                         width: 24,
                         height: 24,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         fontSize: 12,
                         cursor: 'pointer',
                         border: '2px solid white',
                         boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                       }}
                       onClick={(e) => {
                         e.stopPropagation();
                         handleAvatarDelete();
                       }}
                       title="Remove avatar"
                     >
                       ✕
                     </div>
                   )}
                 </div>
                 
                 <div className="flex-grow-1">
                   {isEditing && (
                     <input
                       ref={fileInputRef}
                       type="file"
                       accept="image/*"
                       style={{ display: 'none' }}
                       onChange={handleFileSelect}
                     />
                   )}
                   
                 </div>
               </div>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  ) : (
                    <input type="text" className="form-control" value={user.name} disabled />
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={user.email} disabled />
                </div>
              </div>
            </div>

            {/* Password Change Section - Only show in edit mode */}
            {isEditing && (
              <>
                <hr />
                <div className="mb-4">
                  <h5>🔑 Change Password</h5>
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Old Password"
                        value={editData.oldPassword}
                        onChange={(e) => setEditData({...editData, oldPassword: e.target.value})}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        value={editData.newPassword}
                        onChange={(e) => setEditData({...editData, newPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  <small className="text-muted">Leave blank if you don't want to change password</small>
                </div>
              </>
            )}

            {/* Save Button - Only show in edit mode */}
            {isEditing && (
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg" 
                  onClick={handleSave}
                >
                  💾 Save All Changes
                </button>
              </div>
            )}

            {/* Message Alert */}
            {message && (
              <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-info'} mt-3`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
