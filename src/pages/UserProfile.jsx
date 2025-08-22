import { useEffect, useState } from "react";

let Profile = () => {
  let [user, setUser] = useState(null);
  let [newName, setNewName] = useState("");
  let [oldPassword, setOldPassword] = useState("");
  let [newPassword, setNewPassword] = useState("");
  let [message, setMessage] = useState("");

  let userId = JSON.parse(localStorage.getItem("user"))?._id;

  // Fetch profile
  useEffect(() => {
    let fetchProfile = async () => {
      let res = await fetch(
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
    let res = await fetch(
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
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ keep storage in sync
    }
  };

  // Change password
  let handlePasswordChange = async (e) => {
    e.preventDefault();
    let res = await fetch(
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

  if (!user) return <h2 className="text-center mt-5">Loading profile...</h2>;

  return (
    <div className="container mt-5 pt-5 d-flex justify-content-center align-item-center">
      <div className="row justify-content-center">
        <div className="col">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">👤 My Profile</h2>

            {/* Profile Info */}
            <div className="mb-4">
              <h5 className="mb-3">Profile Information</h5>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <hr />

            {/* Change Name Section */}
            <div className="mb-4">
              <h5>✏️ Update Name</h5>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleNameChange}>
                  Save
                </button>
              </div>
            </div>

            <hr />

            {/* Change Password Section */}
            <div>
              <h5>🔑 Change Password</h5>
              <div className="mb-2">
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  className="btn btn-warning"
                  onClick={handlePasswordChange}
                >
                  Update Password
                </button>
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
