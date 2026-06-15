import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../style/Home.css';

// Import local images
import featuredImage1 from '../assets/home5.jpg';
import featuredImage2 from '../assets/image2.jpg.jpg';
import featuredImage3 from '../assets/image3.jpg';
import userImage from '../assets/user.jpg';
import user1Image from '../assets/user1.jpg';

const Home = () => {
  const projects = [
    { id: '1', title: 'Recipe Finder AI', desc: 'AI-powered meal planning and recipe discovery. SaaS ready with 5k users.', price: '₹25,000', category: 'SaaS', image: featuredImage1 },
    { id: '2', title: 'Productivity MVP', desc: 'Minimalist task management for distributed teams. Built with React/Go.', price: '₹15,000', category: 'MVP', image: featuredImage2 },
    { id: '3', title: 'ClipShare Social', desc: 'Short-form video platform for creators. Optimized for viral distribution.', price: '₹50,000', category: 'APP', image: featuredImage3 },
  ];

  return (
    <div className="home-page-container">
      {/* ══════════════════════════════════════════════════════
          REDESIGNED HERO SECTION — HIGH IMPACT SPLIT LAYOUT
      ══════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-background-glow" />
        
        <div className="hero-container-inner">
          {/* Left Content: Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '32px', color: 'var(--accent)', backdropFilter: 'blur(10px)' }}
            >
              ✨ The Elite Startup Marketplace
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hero-title"
            >
              Acquire the<br />Next Big Idea.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hero-subtitle"
            >
              Skip the development cycle. Browse and acquire ready-to-scale micro-startups, SaaS products, and digital IP from elite builders worldwide.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hero-btn-group"
              style={{ justifyContent: 'flex-start' }}
            >
              <Link to="/projectpage" className="btn-premium btn-primary">
                Browse Deals
              </Link>
              <Link to="/add-project" className="btn-premium btn-secondary">
                List Your IP
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content: Visual Image with Shake & Backlight */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hero-visual-wrapper"
          >
            <div className="hero-img-backlight" />
            <motion.img 
              src={featuredImage1} 
              alt="Premium Startup Asset" 
              className="hero-main-img-card"
              whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
            />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED DEALS — LARGE LIST (LIKE DEALS PAGE)
      ══════════════════════════════════════════════════════ */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '48px' }}
        >
          <h2 className="section-title">🔥 Trending Deals</h2>
          <p className="section-desc">Highly-vetted startups with proven traction and complete documentation.</p>
        </motion.div>
        
        <div className="home-trending-list">
          {projects.map((p, index) => (
            <motion.div 
              key={p.id} 
              className="home-large-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => window.location.href = '/projectpage'}
            >
              <div className="home-card-image">
                <img src={p.image} alt={p.title} />
                <div className="home-card-badge">🔥 Trending</div>
              </div>
              
              <div className="home-card-info">
                <div className="home-card-header">
                  <div className="home-card-tag">{p.category}</div>
                  <h3 className="home-card-title">{p.title}</h3>
                </div>
                <p className="home-card-desc">{p.desc}</p>
                
                <div className="home-card-footer">
                  <div className="home-card-price">{p.price}</div>
                  <Link to="/projectpage" className="home-visit-link">
                    View Details <span>→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SUCCESS STORIES — STANDARD GRID
      ══════════════════════════════════════════════════════ */}
      <section className="section-container" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="section-title">Proven Exits</h2>
          <p className="section-desc">Real founders who found their match on MicroStartupX.</p>
        </div>
        
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <motion.div className="themed-card" style={{ padding: '40px' }} whileHover={{ y: -5 }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
              <img src={userImage} alt="Sarah" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '18px' }}>Sarah Chen</div>
                <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: 900 }}>Exit: ₹15.5L</div>
              </div>
            </div>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>"Sold my SaaS within 72 hours of listing. The verification process and high-quality investor pool are unmatched."</p>
          </motion.div>

          <motion.div className="themed-card" style={{ padding: '40px' }} whileHover={{ y: -5 }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
              <img src={user1Image} alt="Ravi" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '18px' }}>Ravi Kumar</div>
                <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: 900 }}>Exit: ₹8.2L</div>
              </div>
            </div>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>"Found a brilliant developer to acquire my MVP. The platform handled the NDA and legal steps seamlessly."</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARKETPLACE STATS — SUBTLE BAR
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '60px 40px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#fff' }}>500+</div>
            <div style={{ color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '10px', fontSize: '12px' }}>Active Investors</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#fff' }}>₹2.5Cr+</div>
            <div style={{ color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '10px', fontSize: '12px' }}>Total Exit Value</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#fff' }}>48h</div>
            <div style={{ color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '10px', fontSize: '12px' }}>Avg. Closing Time</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
