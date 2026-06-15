import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import '../style/Login.css';
import { useAuth } from '../context/AuthContext';
import api from '../api.js'; // centralized Axios instance

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/api/login', formData);
      if (response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/home');
      } else {
        setMessage('Invalid response from server');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
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
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      } 
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
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="bg-glow glow-1" 
        />
        <motion.div 
          style={{ x: useSpring(useMotionValue(0), springConfig), y: useSpring(useMotionValue(0), springConfig) }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="bg-glow glow-2" 
        />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="floating-element" 
        style={{ top: '15%', left: '10%', width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '12px' }}
      />
      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="floating-element" 
        style={{ bottom: '20%', right: '15%', width: '30px', height: '30px', border: '2px solid var(--accent)', borderRadius: '50%' }}
      />

      {/* Main Login Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="login-container"
      >
        <div className="login-header">
          <motion.h1 variants={itemVariants} className="login-title">
            Welcome Back
          </motion.h1>
          <motion.p variants={itemVariants} className="login-subtitle">
            Sign in to your account to continue
          </motion.p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`login-message ${message.toLowerCase().includes('failed') ? 'error' : 'success'}`}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="login-form">
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
              placeholder="••••••••"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-options">
            <Link to="/forgot-password" intrinsic="true" className="forgot-password">
              Forgot Password?
            </Link>
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
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="login-footer">
          <p className="register-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="register-link">Sign up here</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
