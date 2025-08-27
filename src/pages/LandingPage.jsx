import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="container-fluid mt-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <div className="card glass-card shadow-lg">
            <div className="card-body p-5">
              <div className="mb-4">
                <h1 className="display-3 gradient-text mb-3">Welcome to Frendora</h1>
                <div className="text-center mb-4">
                  <span className="badge bg-primary fs-6 px-3 py-2">✨ Share • Connect • Inspire</span>
                </div>
              </div>
              <p className="lead mb-5 text-muted">
                A modern platform for sharing and discovering amazing content with your friends.
                Create, connect, and inspire with beautiful media-rich posts.
              </p>
              <div className="d-grid gap-3 d-md-block mb-4">
                <Link to="/login" className="btn btn-primary btn-lg me-md-3 px-4">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-primary btn-lg px-4">
                  <i className="bi bi-person-plus me-2"></i>
                  Sign Up
                </Link>
              </div>
              <div className="mt-5">
                <div className="row text-center">
                  <div className="col-md-4 mb-3">
                    <i className="bi bi-images text-primary fs-1 mb-2"></i>
                    <h6>Rich Media</h6>
                    <small className="text-muted">Share images & videos</small>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="bi bi-people text-primary fs-1 mb-2"></i>
                    <h6>Connect</h6>
                    <small className="text-muted">Build communities</small>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="bi bi-lightning text-primary fs-1 mb-2"></i>
                    <h6>Inspire</h6>
                    <small className="text-muted">Share your stories</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
