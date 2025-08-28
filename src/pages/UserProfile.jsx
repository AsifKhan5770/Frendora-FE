import { useEffect, useState, useRef } from "react";
import { authenticatedFetch } from "../utils/api";

let Profile = () => {
  let [user, setUser] = useState(null);
  let [newName, setNewName] = useState("");
  let [oldPassword, setOldPassword] = useState("");
  let [newPassword, setNewPassword] = useState("");
  let [message, setMessage] = useState("");
  let [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);
  const openFilePicker = () => fileInputRef.current && fileInputRef.current.click();

  // Auto-upload helper when a file is chosen
  const uploadSelectedFile = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await authenticatedFetch(
      `http://localhost:3001/api/users/profile/${userId}/avatar`,
      {
        method: "POST",
        body: formData,
        headers: {},
      }
    );
    const data = await res.json();
           setMessage(data.message || (res.ok ? "Avatar updated" : "Error uploading avatar"));
       if (res.ok) {
         setUser(data.user);
         localStorage.setItem("user", JSON.stringify(data.user));
         setAvatarPreview("");
       }
  };

  let stored = JSON.parse(localStorage.getItem("user"));
  let userId = stored?.id || stored?._id;

  // Fetch profile
  useEffect(() => {
    let fetchProfile = async () => {
      let res = await authenticatedFetch(
        `http://localhost:3001/api/users/profile/${userId}`
      );
      let data = await res.json();
      setUser(data);
      setNewName(data.name);
    };
    if (userId) fetchProfile();
  }, [userId]);

  // Update name
  let handleNameChange = async (e) => {
    e.preventDefault();
    let res = await authenticatedFetch(
      `http://localhost:3001/api/users/profile/${userId}/name`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }
    );
    let data = await res.json();
    setMessage(data.message || "Error updating name");
    
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  // Change password
  let handlePasswordChange = async (e) => {
    e.preventDefault();
    let res = await authenticatedFetch(
      `http://localhost:3001/api/users/profile/${userId}/password`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );
    let data = await res.json();
    setMessage(data.message || "Error changing password");

    if (res.ok) {
      setOldPassword("");
      setNewPassword("");
    }
  };

  // Delete avatar
  let handleAvatarDelete = async () => {
    let res = await authenticatedFetch(
      `http://localhost:3001/api/users/profile/${userId}/avatar`,
      { method: "DELETE" }
    );
    let data = await res.json();
    setMessage(data.message || "Error deleting avatar");
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAvatarPreview("");
    }
  };

  if (!user) return <h2 className="text-center mt-5">Loading profile...</h2>;

  return (
    <div className="container mt-5 pt-5 d-flex justify-content-center align-item-center">
      <div className="row justify-content-center w-100" style={{maxWidth: 720}}>
        <div className="col-12">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">👤 My Profile</h2>

            {/* Profile Info */}
            <div className="mb-4">
              <h5 className="mb-3">Profile Information</h5>
              <div className="mb-3 d-flex align-items-center">
                {avatarPreview || user.avatarUrl ? (
                  <div
                    onClick={openFilePicker}
                    style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 16, position: 'relative', cursor: 'pointer' }}
                  >
                    <img
                      src={avatarPreview || `http://localhost:3001/uploads/${user.avatarUrl}`}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                                         {/* Edit badge */}
                     <span
                       style={{ position: 'absolute', bottom: -4, right: -4, background: '#0d6efd', color: '#fff', borderRadius: 12, fontSize: 10, padding: '2px 6px' }}
                     >
                       Edit
                     </span>
                  </div>
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    onClick={openFilePicker}
                    style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#e9ecef', color: '#495057', fontWeight: 600, fontSize: 20, marginRight: 16, cursor: 'pointer', position: 'relative' }}
                  >
                    {((user.name || user.email || '?')
                      .split(' ')
                      .map(w => w[0])
                      .join('')
                      .slice(0, 2)
                    ).toUpperCase()}
                    <span
                      style={{ position: 'absolute', bottom: -4, right: -4, background: '#0d6efd', color: '#fff', borderRadius: 12, fontSize: 10, padding: '2px 6px' }}
                    >
                      Add
                    </span>
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                                         onChange={async (e) => {
                       const file = e.target.files?.[0] || null;
                       if (!file) { setAvatarPreview(""); return; }
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
                       const reader = new FileReader();
                       reader.onload = () => setAvatarPreview(reader.result);
                       reader.readAsDataURL(file);
                       await uploadSelectedFile(file);
                     }}
                  />
                  {user.avatarUrl && (
                    <div className="mt-2">
                      <button className="btn btn-outline-danger btn-sm px-2 py-1" onClick={handleAvatarDelete}>
                        Delete Image
                      </button>
                    </div>
                  )}
                  {/* Buttons removed: avatar click handles upload; delete via overlay button */}
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={user.name} disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={user.email} disabled />
                </div>
              </div>
            </div>

            <hr />

            {/* Change Name Section */}
            <div className="mb-4">
              <h5>✏️ Update Name</h5>
              <div className="row g-2">
                <div className="col-12 col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="col-12 col-sm-4 d-grid">
                  <button className="btn btn-primary" onClick={handleNameChange}>
                    Save
                  </button>
                </div>
              </div>
            </div>

            <hr />

            {/* Change Password Section */}
            <div>
              <h5>🔑 Change Password</h5>
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="col-12 d-grid">
                  <button
                    className="btn btn-warning"
                    onClick={handlePasswordChange}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Message Alert */}
            {message && <div className="alert alert-info mt-3">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
