import React from 'react';
import '../style/Dashboard.css';
import { FaQuestionCircle, FaEnvelope, FaCommentDots } from 'react-icons/fa';

export default function HelpSupport() {
  return (
    <div className="dash-account-card" style={{ marginTop: 40, maxWidth: 540 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaQuestionCircle /> Help & Support</h3>
      <div style={{ marginBottom: 18 }}>
        <details style={{ marginBottom: 10 }}>
          <summary style={{ fontWeight: 500, cursor: 'pointer' }}>How do I change my password?</summary>
          <div style={{ color: '#6b7280', marginTop: 4 }}>Go to Edit Profile and update your password securely.</div>
        </details>
        <details style={{ marginBottom: 10 }}>
          <summary style={{ fontWeight: 500, cursor: 'pointer' }}>How do I contact support?</summary>
          <div style={{ color: '#6b7280', marginTop: 4 }}>Click the Contact Support button below or email us at <a href="mailto:support@microstartupx.com">support@microstartupx.com</a>.</div>
        </details>
        <details style={{ marginBottom: 10 }}>
          <summary style={{ fontWeight: 500, cursor: 'pointer' }}>How do I delete my account?</summary>
          <div style={{ color: '#6b7280', marginTop: 4 }}>Go to Settings and click Delete Account. This action is permanent.</div>
        </details>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <button className="dash-btn dash-btn-secondary" onClick={() => window.open('mailto:support@microstartupx.com')}><FaEnvelope style={{ marginRight: 6 }} />Contact Support</button>
        <button className="dash-btn dash-btn-secondary" onClick={() => alert('Thank you for your feedback!')}><FaCommentDots style={{ marginRight: 6 }} />Submit Feedback</button>
      </div>
    </div>
  );
} 