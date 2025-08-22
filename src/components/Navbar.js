import { Link } from "react-router-dom";

let Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-glass fixed-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-pink" to="/">
          Frendora
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
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="profile"
              className="profile-avatar dropdown-toggle"
              data-bs-toggle="dropdown"
              
            />
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;