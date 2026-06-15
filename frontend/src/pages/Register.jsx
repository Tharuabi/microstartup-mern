import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import api from '../api.js';
import '../style/Login.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', userType: 'user' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  // Mouse movement parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 40);
      mouseY.set((clientY / innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/api/register', formData);
      setMessage(res.data.message || 'Registration successful!');
      setMessageType('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="login-page">
      {/* Parallax Background Glows */}
      <div className="login-background">
        <motion.div 
          style={{ x: springX, y: springY }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="bg-glow glow-1" 
        />
        <motion.div 
          style={{ x: useSpring(useMotionValue(0), springConfig), y: useSpring(useMotionValue(0), springConfig) }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="bg-glow glow-2" 
        />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="floating-element" 
        style={{ top: '10%', right: '10%', width: '50px', height: '50px', background: 'var(--accent)', borderRadius: '15px' }}
      />
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="floating-element" 
        style={{ bottom: '15%', left: '15%', width: '35px', height: '35px', border: '2px solid var(--accent)', borderRadius: '50%' }}
      />

      {/* Main Register Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="login-container"
        style={{ maxWidth: '520px' }}
      >
        <div className="login-header">
          <motion.h1 variants={itemVariants} className="login-title">
            Create Account
          </motion.h1>
          <motion.p variants={itemVariants} className="login-subtitle">
            Join 500+ visionary founders and investors
          </motion.p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`login-message ${messageType === 'success' ? 'success' : 'error'}`}
          >
            {messageType === 'success' ? '✓' : '⚠'} {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text" id="name" name="name" value={formData.name}
              onChange={handleChange} required className="form-input"
              placeholder="Your full name"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email" id="email" name="email" value={formData.email}
              onChange={handleChange} required className="form-input"
              placeholder="name@company.com"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password" id="password" name="password" value={formData.password}
              onChange={handleChange} required className="form-input"
              placeholder="Create a strong password"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="userType">Account Type</label>
            <select 
              name="userType" id="userType" value={formData.userType} onChange={handleChange}
              className="form-input"
              style={{ appearance: 'none', background: 'var(--input-bg) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'rgba(255,255,255,0.3)\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E") no-repeat right 1rem center / 1.2rem' }}
            >
              <option value="user" style={{ background: '#1a1a1a' }}>Investor / Founder</option>
              <option value="admin" style={{ background: '#1a1a1a' }}>Admin</option>
            </select>
          </motion.div>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(255, 78, 205, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            type="submit" className="login-button" disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="login-footer">
          <p className="register-prompt">
            Already have an account?{' '}
            <Link to="/login" className="register-link">Sign in here</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;