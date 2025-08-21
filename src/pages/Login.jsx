import { Link } from "react-router-dom";

let Login = () => {
  return (
    <main className="card" role="main" aria-label="Login to Frendora">
      <div className="brand" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="5" stroke="#111827" strokeWidth="1.5"/>
          <path d="M8 5.5l1.2-2a2 2 0 0 1 1.7-1h2.2a2 2 0 0 1 1.7 1l1.2 2" stroke="#111827" strokeWidth="1.5"/>
          <circle cx="12" cy="13" r="4" stroke="#111827" strokeWidth="1.5"/>
          <circle cx="18.5" cy="9.5" r="1" fill="#111827"/>
        </svg>
        <h1>Frendora</h1>
      </div>

      <form autoComplete="on" noValidate>
        <label className="field">
          <span className="icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 21a9 9 0 1 1 18 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <input name="username" type="text" placeholder="Username" aria-label="Username" required />
        </label>

        <label className="field">
          <span className="icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 11V8a5 5 0 1 1 10 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <input name="password" type="password" placeholder="Password" aria-label="Password" required />
        </label>

        <div className="actions">
          <button className="btn" type="submit" aria-label="Log in to Frendora">Log In</button>
        </div>

        <p className="links" aria-live="polite">
          <Link to="#">Forgot password?</Link>
        </p>

        <p className="helper">Don’t have an account? <Link to="/signup">Sign up</Link></p>

        <p className="legal">By logging in, you agree to our Terms & Privacy Policy.</p>
      </form>
    </main>
  );
};

export default Login;