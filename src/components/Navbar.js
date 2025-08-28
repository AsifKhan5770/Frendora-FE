import { Link } from "react-router-dom";
import { logout } from '../utils/api';

let Navbar = () => {

  // Safely parse user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

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
              user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="profile"
                  className="profile-avatar dropdown-toggle"
                  data-bs-toggle="dropdown"
                />
              ) : (
                <div
                  className="dropdown-toggle d-flex align-items-center justify-content-center"
                  data-bs-toggle="dropdown"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  {((user.name || user.email || '?')
                    .split(' ')
                    .map(w => w[0])
                    .join('')
                    .slice(0, 2)
                  ).toUpperCase()}
                </div>
              )
            ):(
              <Link to='/login'>
                <img
                src="https://icons.veryicon.com/png/o/miscellaneous/icon-icon-of-ai-intelligent-dispensing/login-user-name-1.png"
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
