import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Dashboard.css';

export default function EditProfile() {
  const { profilePic, setProfilePic, user } = useAuth();
  const userId = user?.id; // Use real userId from context
  const [form, setForm] = useState({
    name: 'Alex Developer',
    email: 'alex@example.com',
    phone: '',
    address: '',
  });
  const [picFile, setPicFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const profilePicUrl = profilePic
    ? (typeof profilePic === 'string'
       ? (profilePic.startsWith('http') ? profilePic : `${profilePic}`)
        : URL.createObjectURL(profilePic))
    : null;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePicChange = e => {
    if (e.target.files && e.target.files[0]) {
      setPicFile(e.target.files[0]);
      setProfilePic(e.target.files[0]); // for instant preview
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(false);
    setUploading(true);
    try {
      if (picFile) {
        const formData = new FormData();
        formData.append('profilePic', picFile);
        formData.append('userId', userId);
        const res = await axios.post('/api/user/profile-pic', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data && res.data.profilePic) {
          setProfilePic(res.data.profilePic);
        }
      }
      // TODO: Save other profile fields to backend if needed
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      alert('Failed to update profile picture.');
    }
    setUploading(false);
  };

  return (
    <div className="dash-account-card" style={{ marginTop: 40, maxWidth: 420 }}>
      <h3>Edit Profile</h3>
      <form className="dash-account-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
          <div className="dash-profile-pic-preview">
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span role="img" aria-label="profile" style={{ fontSize: 40 }}>👤</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontWeight: 500, marginBottom: 4 }}>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
          <label style={{ fontWeight: 500, marginBottom: 4 }}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          <label style={{ fontWeight: 500, marginBottom: 4 }}>Phone Number</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          <label style={{ fontWeight: 500, marginBottom: 4 }}>Profile Picture</label>
          <input type="file" accept="image/*" onChange={handlePicChange} />
          <label style={{ fontWeight: 500, marginBottom: 4 }}>Address Info</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} />
        </div>
        <button type="submit" className="dash-btn dash-btn-primary" style={{ marginTop: 18 }} disabled={uploading}>{uploading ? 'Saving...' : 'Save Changes'}</button>
        {success && <div style={{ color: '#22c55e', marginTop: 10 }}>Profile updated!</div>}
        <button type="button" className="dash-btn dash-btn-secondary" style={{ marginTop: 10 }} onClick={() => navigate(-1)}>Back</button>
      </form>
    </div>
  );
} 