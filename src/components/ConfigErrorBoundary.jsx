import React from 'react';
import config from '../config/config';

const ConfigErrorBoundary = ({ children }) => {
  // Check if API configuration is missing
  if (!config.API_BASE_URL) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">⚠️ Configuration Error</h4>
              <p>The application is not properly configured. Please check the following:</p>
              
              <h6>For Local Development:</h6>
              <ol>
                <li>Create a <code>.env</code> file in the <code>Frendora-FE</code> directory</li>
                <li>Add this line: <code>REACT_APP_API_BASE_URL=http://localhost:3001/api</code></li>
                <li>Restart your development server</li>
              </ol>
              
              <h6>For Vercel Deployment:</h6>
              <ol>
                <li>Go to your Vercel project dashboard</li>
                <li>Navigate to Settings → Environment Variables</li>
                <li>Add: <code>REACT_APP_API_BASE_URL</code> with your backend URL</li>
                <li>Redeploy your application</li>
              </ol>
              
              <hr />
              <p className="mb-0">
                <strong>Current Status:</strong> API_BASE_URL is not configured
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ConfigErrorBoundary;
