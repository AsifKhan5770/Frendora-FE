import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, getUploadUrl } from '../utils/api';

let Navbar = () => {
  const [user, setUser] = useState(null);

  // Safely parse user from localStorage
  const updateUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    updateUserFromStorage();
    
    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      setUser(event.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Get avatar URL with fallback to placeholder
  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      return getUploadUrl(user.avatarUrl);
    }
    return '/placeholder.png';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass fixed-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand gradient-text" to="/">
          ✨ Frendora
        </Link>
        {/* Toggle button (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapse section */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Left nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

          {/* Profile dropdown */}
          <div className="dropdown">
                        {user ? (
              <img
                src={getAvatarUrl()}
                alt="profile"
                className="profile-avatar dropdown-toggle"
                data-bs-toggle="dropdown"
                style={{
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa'
                }}
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
            ) : (
              <Link to='/login'>
                <img
                  src="/placeholder.png"
                  alt="profile"
                  className="profile-avatar"
                />
              </Link>
            )}
              {user && (
            <ul className="dropdown-menu dropdown-menu-end">
                <>
                  <li>
                    <Link className="dropdown-item" to="/posts">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
            </ul>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
