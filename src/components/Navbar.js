import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, getUploadUrl } from '../utils/api';

let Navbar = () => {
  const [user, setUser] = useState(null);

  // Safely parse user from localStorage
  const updateUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    console.log('updateUserFromStorage called, parsed user:', parsedUser);
    setUser(parsedUser);
  };

  useEffect(() => {
    updateUserFromStorage();
    
    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      console.log('Profile updated event received:', event.detail);
      setUser(event.detail);
    };
    
    // Listen for login events
    const handleLogin = () => {
      console.log('Login event received, updating user from storage');
      updateUserFromStorage();
    };
    
    // Listen for storage changes (when localStorage is updated from other tabs/components)
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        console.log('Storage change detected, updating user');
        updateUserFromStorage();
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('login', handleLogin);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Get avatar URL with fallback to placeholder
  const getAvatarUrl = () => {
    console.log('Navbar getAvatarUrl called, user:', user);
    if (user?.avatarUrl) {
      const avatarUrl = getUploadUrl(user.avatarUrl);
      console.log('Avatar URL generated:', avatarUrl);
      return avatarUrl;
    }
    console.log('No avatar URL, using placeholder');
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
              <>
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
                {/* Debug info - remove this later */}
                <small style={{ color: 'white', fontSize: '10px', display: 'block' }}>
                  {user.avatarUrl ? 'Has avatar' : 'No avatar'}
                </small>
              </>
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
