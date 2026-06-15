import React, { useState } from 'react';
import '../style/Dashboard.css';
import { FaRegBell, FaLanguage, FaUserShield } from 'react-icons/fa';

export default function Settings() {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    language: 'English',
    privacy: 'Standard',
    darkMode: false,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="dash-account-card" style={{ marginTop: 40, maxWidth: 480 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaRegBell /> Settings</h3>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleSubmit}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="email" checked={settings.email} onChange={handleChange} /> Email Notifications
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="sms" checked={settings.sms} onChange={handleChange} /> SMS Alerts
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaLanguage /> Language:
          <select name="language" value={settings.language} onChange={handleChange} style={{ marginLeft: 8 }}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaUserShield /> Privacy:
          <select name="privacy" value={settings.privacy} onChange={handleChange} style={{ marginLeft: 8 }}>
            <option>Standard</option>
            <option>Strict</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="darkMode" checked={settings.darkMode} onChange={handleChange} /> Dark Mode
        </label>
        <button type="submit" className="dash-btn dash-btn-primary" style={{ marginTop: 8 }}>Save Settings</button>
        {saved && <div style={{ color: '#22c55e', marginTop: 8 }}>Settings saved!</div>}
      </form>
    </div>
  );
} 