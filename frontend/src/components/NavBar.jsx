import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../style/NavBar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';
  
  const cartItemCount = getCartItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    // Navigate to landing page after logout
    navigate('/');
    // Optional: Show success message
    if (window.toast) {
      window.toast.success('Successfully logged out!');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          MicroStartupX
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {!user ? (
            // Not logged in - show login/register
            <>
              <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              <Link to="/login" className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
              <Link to="/register" className={`navbar-link logout-btn`}>Get Started</Link>
            </>
          ) : (
            // Logged in - show all navigation options
            <>
              <Link to="/home" className={`navbar-link ${location.pathname === '/home' ? 'active' : ''}`}>Explore</Link>
              <Link to="/dashboard" className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/projectpage" className={`navbar-link ${location.pathname === '/projectpage' ? 'active' : ''}`}>Deals</Link>
              <Link to="/add-project" className={`navbar-link ${location.pathname === '/add-project' ? 'active' : ''}`}>Launch</Link>
              <Link to="/add-idea" className={`navbar-link ${location.pathname === '/add-idea' ? 'active' : ''}`}>Idea</Link>
              <Link to="/funding" className={`navbar-link ${location.pathname === '/funding' ? 'active' : ''}`}>Funding</Link>
              
              {/* Cart Button with Item Count */}
              <Link to="/cart" className="navbar-cart-link">
                <div className="cart-icon-container">
                  <span className="cart-icon">🛒</span>
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
                </div>
              </Link>
              
              <button onClick={handleLogout} className="navbar-link logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;