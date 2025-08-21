import { Link } from "react-router-dom";

let Signup = () => {
  return (
    <main className="card" role="main" aria-label="Sign up for Frendora">
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
          <input name="fullname" type="text" placeholder="Full Name" aria-label="Full Name" required />
        </label>

        <label className="field">
          <span className="icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16v16H4z" fill="none"/>
              <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 8h16" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v16" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </span>
          <input name="email" type="email" placeholder="Email" aria-label="Email" required />
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

        <label className="field">
          <span className="icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 11V8a5 5 0 1 1 10 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <input name="confirmPassword" type="password" placeholder="Confirm Password" aria-label="Confirm Password" required />
        </label>

        <div className="actions">
          <button className="btn" type="submit" aria-label="Sign up to Frendora">Sign Up</button>
        </div>

        <p className="helper">Already have an account? <Link to="/login">Log in</Link></p>

        <p className="legal">By signing up, you agree to our Terms & Privacy Policy.</p>
      </form>
    </main>
  );
};

export default Signup;