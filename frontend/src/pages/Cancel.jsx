import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Success.css';

const Cancel = () => {
  return (
    <div className="cancel-page">
      <div className="cancel-container">
        <div className="cancel-icon">❌</div>
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. No charges were made to your account.</p>
        <div className="action-buttons">
          <Link to="/projectpage" className="primary-button">
            Try Again
          </Link>
          <Link to="/dashboard" className="secondary-button">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
