import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import image3 from '../assets/image3.jpg';

const LandingPage = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [activeTab, setActiveTab] = useState('founders');
  const [stats, setStats] = useState({ ideas: 0, funded: 0, investors: 0, deals: 0 });
  const [hoveredPillar, setHoveredPillar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { user } = useAuth?.() || {};
  const navigate = useNavigate();
  const pricingSectionRef = useRef(null);
  const marketplaceRef = useRef(null);
  const pillarsRef = useRef(null);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const image3Ref = useRef(null);
  const pillarsInView = useInView(pillarsRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll();
  
  const image3Scroll = useScroll({
    target: image3Ref,
    offset: ["start end", "end start"]
  });

  const image3Scale = useTransform(image3Scroll.scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);
  const image3Opacity = useTransform(image3Scroll.scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const image3Rotate = useTransform(image3Scroll.scrollYProgress, [0, 1], [-5, 5]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.2 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  /* ── Mouse glow follow ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  const trendingIdeas = [
    { id: 1, title: "Eco-Charge AI", category: "Hardware / SaaS", price: "₹2,50,000", type: "Buy Concept", equity: "100% IP", votes: 234, daysLeft: 12, badge: "HOT", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80", color: "#16a34a", founder: "Ravi S.", location: "Chennai" },
    { id: 2, title: "FinFlow Tamil", category: "Fintech", price: "₹5,00,000", type: "Seeking Seed", equity: "10% Equity", votes: 189, daysLeft: 8, badge: "NEW", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", color: "#0891b2", founder: "Meena K.", location: "Coimbatore" },
    { id: 5, title: "AgriSense IoT", category: "AgriTech", price: "₹7,50,000", type: "Seeking Series A", equity: "18% Equity", votes: 428, daysLeft: 14, badge: "TOP", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80", color: "#3a6b4a", founder: "Kumar R.", location: "Salem" },
  ];

  const founderWins = [
    { name: "Arun Kumar", amount: "₹15 Lakhs", label: "Equity Funded", text: "I uploaded my prototype for an automated irrigation system. Within 2 weeks, I found an investor who bought 15% equity. MicroStartupX changed my life completely.", role: "CEO, AgriSmart", initials: "AK", tag: "AgriTech", year: "2025" },
    { name: "Priya Lakshmi", amount: "₹4 Lakhs", label: "IP Sold", text: "I am a developer but didn't want to run a business. I sold my SaaS codebase here to a business owner and immediately moved on to my next project. Brilliant platform.", role: "Independent Developer", initials: "PL", tag: "SaaS Dev", year: "2025" },
    { name: "Karthik Rajan", amount: "₹25 Lakhs", label: "Seed Round", text: "Three investors competed to fund my logistics startup. The platform made due diligence seamless and secure. It's the real Shark Tank for Tamil Nadu founders.", role: "Founder, SwiftDeliver", initials: "KR", tag: "Logistics", year: "2026" },
  ];

  const pricingPlans = [
    { name: "Seedling", price: "Free", period: "forever", features: ["1 Active Listing", "Community Chat", "Standard Support", "Basic Analytics", "Public Profile"], cta: "Start Free", popular: false },
    { name: "Singam Pro", price: "₹1,499", period: "/mo", features: ["Unlimited Listings", "Verified Badge", "Direct Investor DMs", "NDA Templates", "Priority Support", "Advanced Analytics"], cta: "Go Pro", popular: true },
    { name: "Enterprise", price: "₹4,999", period: "/mo", features: ["Featured Placement", "Legal Assistance", "Valuation Report", "Priority Matching", "Dedicated Manager", "API Access"], cta: "Scale Now", popular: false },
  ];

  const categories = [
    { name: "SaaS", count: 234, icon: "💻" }, { name: "Fintech", count: 156, icon: "💰" },
    { name: "E-commerce", count: 189, icon: "🛒" }, { name: "AI/ML", count: 98, icon: "🤖" },
    { name: "HealthTech", count: 67, icon: "🏥" }, { name: "EdTech", count: 123, icon: "📚" },
    { name: "Logistics", count: 88, icon: "🚚" }, { name: "AgriTech", count: 45, icon: "🌾" },
  ];

  const howItWorksFounders = [
    { num: "01", icon: "💡", title: "Post Your Idea", sub: "Share your concept", desc: "Upload your pitch deck, MVP demo, business plan or concept note. Set your funding goal or selling price." },
    { num: "02", icon: "🔍", title: "Get Discovered", sub: "Reach 450+ investors", desc: "Your listing reaches verified investors, business buyers and developers actively looking for opportunities." },
    { num: "03", icon: "🤝", title: "Negotiate", sub: "Protected discussions", desc: "Chat via secure DMs, share NDA-protected documents, and negotiate deal terms with confidence." },
    { num: "04", icon: "💰", title: "Close the Deal", sub: "Escrow-backed payment", desc: "Complete the transaction securely. Funds are held in escrow until both parties confirm." },
  ];

  const howItWorksInvestors = [
    { num: "01", icon: "🔎", title: "Browse Deals", sub: "Filter by category", desc: "Explore thousands of verified ideas, codebases and startups filtered by sector, stage and investment size." },
    { num: "02", icon: "📊", title: "Due Diligence", sub: "Request documents", desc: "Access founder details, financial projections, IP documents and chat directly with the startup team." },
    { num: "03", icon: "⚡", title: "Make an Offer", sub: "Transparent bidding", desc: "Submit your offer, negotiate equity or price. See competing interest to make faster decisions." },
    { num: "04", icon: "🏆", title: "Acquire & Grow", sub: "Secure transfer", desc: "All documentation, IP transfer and onboarding is handled on-platform with full legal support." },
  ];

  const pillars = [
    { key: 'founders', label: 'For Founders', headline: 'Post & Fund\nYour Idea', sub: 'Turn concepts into capital', desc: 'Upload your pitch, set your price, reach 450+ verified investors. From concept to funded in days.', points: ['Set your funding goal or selling price', 'Reach 450+ verified investors instantly', 'Escrow-protected deal closing', 'NDA-backed negotiations'], img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80', badge: 'STARTUP' },
    { key: 'developers', label: 'For Developers', headline: 'Sell Code\nor IP', sub: 'Monetise your work', desc: 'List your codebase, SaaS, or app. Sell outright or license your IP. Full legal transfer support.', points: ['Sell outright or licence your IP', 'Full NDA & IP transfer support', 'Set your price, receive offers', 'Get paid, move to next project'], img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', badge: 'BUILDER' },
    { key: 'investors', label: 'For Investors', headline: 'Invest &\nAcquire', sub: 'Discover Tamil Nadu deals', desc: 'Browse 2,500+ verified startups. AI-matched deal suggestions, due diligence tools built in.', points: ['Browse 2,500+ verified startups', 'Filter by sector, stage & ticket', 'AI-matched deal suggestions', 'Due diligence tools built in'], img: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80', badge: 'INVESTOR' },
  ];

  const liveDeals = [
    { name: "AgriSense IoT", amt: "₹7.5L", type: "funded", time: "2m ago" },
    { name: "FinFlow Tamil", amt: "₹5L", type: "listed", time: "5m ago" },
    { name: "QuickDeli MVP", amt: "₹85K", type: "sold", time: "12m ago" },
    { name: "EduTech Pro", amt: "₹3.2L", type: "offer", time: "18m ago" },
    { name: "HealthSync", amt: "₹4L", type: "funded", time: "24m ago" },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentStory(p => (p + 1) % founderWins.length), 6000);
    const targets = { ideas: 2500, funded: 180, investors: 450, deals: 89 };
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = Math.min(step / 60, 1);
      setStats({
        ideas: Math.floor(targets.ideas * p),
        funded: Math.floor(targets.funded * p),
        investors: Math.floor(targets.investors * p),
        deals: Math.floor(targets.deals * p),
      });
      if (step >= 60) clearInterval(timer);
    }, 30);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, []);

  const masonryItems = [
    { id: 1, title: "SaaS Platform", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80", height: "240px" },
    { id: 2, title: "AgriTech IoT", img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=300&q=80", height: "320px" },
    { id: 3, title: "AI Chatbot", img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=300&q=80", height: "280px" },
    { id: 4, title: "Fintech App", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80", height: "300px" },
    { id: 5, title: "Health Monitoring", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80", height: "260px" },
    { id: 6, title: "Logistics Dashboard", img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=300&q=80", height: "240px" },
  ];

  const C = {
    bg: '#0B0B0F', // High-end Dark base
    bg2: '#0D0D12',
    surface: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textMid: '#A1A1A6',
    textLight: '#71717A',
    accent: '#ff4ecd', // Premium Pink
    accentGold: '#F59E0B',
    white: '#ffffff',
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif", background: C.bg, color: C.text, overflowX: 'hidden', minHeight: '100vh', letterSpacing: '-0.02em' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0B0B0F; }
        ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 10px; }
        
        .premium-font { font-family: 'Inter', sans-serif; }
        .tesla-font { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; filter: blur(80px); }
          50% { opacity: 0.8; filter: blur(60px); }
        }
        
        .btn-cta-premium { 
          display:inline-flex; 
          align-items:center; 
          gap:10px; 
          padding:18px 44px; 
          background:#ffffff; 
          border:none; 
          border-radius:100px; 
          font-family:'Inter',sans-serif; 
          font-size:16px; 
          font-weight:800; 
          color:#000; 
          cursor:pointer; 
          transition:all .4s cubic-bezier(0.19, 1, 0.22, 1); 
          box-shadow: 0 10px 30px rgba(255,255,255,0.1);
        }
        .btn-cta-premium:hover { 
          transform: scale(1.05) translateY(-2px); 
          box-shadow: 0 15px 40px rgba(255, 78, 205, 0.5); 
          background: #f8f8f8;
        }
        
        .btn-secondary-premium { 
          display:inline-flex; 
          align-items:center; 
          gap:10px; 
          padding:18px 44px; 
          background:rgba(255, 255, 255, 0.08); 
          border:1.5px solid rgba(255, 255, 255, 0.2); 
          border-radius:100px; 
          font-family:'Inter',sans-serif; 
          font-size:16px; 
          font-weight:800; 
          color:#fff; 
          cursor:pointer; 
          transition:all .4s cubic-bezier(0.19, 1, 0.22, 1);
          backdrop-filter: blur(12px);
        }
        .btn-secondary-premium:hover { 
          background:rgba(255, 255, 255, 0.15); 
          border-color:#ff4ecd; 
          transform: scale(1.05) translateY(-2px); 
        }

        .glass-card-premium {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          transition: border-color 0.3s ease;
        }
        .glass-card-premium:hover {
          border-color: rgba(255, 78, 205, 0.3);
        }

        .hero-glow-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle at top left, #ff4ecd33, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .glowing-edge {
          position: relative;
        }
        .glowing-edge::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(45deg, transparent, rgba(255, 78, 205, 0.3), transparent);
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>


      <section
        ref={heroRef}
        style={{ minHeight: '140vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: '#0B0B0F', paddingTop: '100px' }}
      >
        {/* Top Left Gradient Glow — MORE VISIBLE */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: '70%', background: 'radial-gradient(circle at top left, #ff4ecd44, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

        {/* Animated Background Elements */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '60%', pointerEvents: 'none', zIndex: 1 }}>
          {/* Bottom Glowing Arc (Pink/Purple Neon) — ENHANCED */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ 
              position: 'absolute', 
              bottom: '-10%', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              width: '1600px', 
              height: '800px', 
              background: 'radial-gradient(ellipse at center, rgba(255, 78, 205, 0.2) 0%, transparent 75%)',
              borderRadius: '50% 50% 0 0',
              filter: 'blur(120px)'
            }} 
          />
        </div>

        {/* Hero Content */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroTextY, flex: 1, position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>

          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', marginBottom: 35 }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Trusted by 500+ startups</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.8 }}
            className="premium-font"
            style={{ fontSize: 'clamp(56px, 8vw, 110px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: 30, maxWidth: '1000px' }}
          >
            Fund the Next<br /><span style={{ background: 'linear-gradient(90deg, #fff, #ff4ecd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Big Idea 🚀</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ fontSize: 'clamp(18px, 1.3vw, 22px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, textAlign: 'center', maxWidth: '650px', marginBottom: 50, fontWeight: 500 }}
          >
            Connect visionary founders with elite investors instantly. The premier platform for Tamil Nadu's micro-startup ecosystem.
          </motion.p>

          {/* CTA Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ display: 'flex', gap: 20, marginBottom: 80 }}
          >
            <button className="btn-cta-premium">Get Started</button>
            <button className="btn-secondary-premium">Browse Deals</button>
          </motion.div>

          {/* Floating Premium Cards */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '500px' }}>
            
            {/* Card 1: Funding Stats */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', left: '10%', top: '0', zIndex: 10 }}
            >
              <div className="glass-card-premium glowing-edge" style={{ padding: '24px', width: '280px', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', color: '#ff4ecd', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>Live Update</div>
                <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '5px' }}>₹4L Raised</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>AgriSmart Approval 🚀</div>
              </div>
            </motion.div>

            {/* Card 2: Growth Chart */}
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{ position: 'absolute', right: '12%', top: '20%', zIndex: 10 }}
            >
              <div className="glass-card-premium" style={{ padding: '24px', width: '300px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Investor Growth</div>
                  <div style={{ color: '#27c93f', fontWeight: 800 }}>+24%</div>
                </div>
                <div style={{ height: '80px', width: '100%', background: 'linear-gradient(90deg, rgba(255,78,205,0.1), rgba(138,43,226,0.2))', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, borderBottom: '2px solid #ff4ecd', opacity: 0.5 }} />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Startup Card (Main Product Feel) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              style={{ position: 'absolute', left: '50%', top: '10%', transform: 'translateX(-50%)', zIndex: 5 }}
            >
              <div className="glass-card-premium" style={{ width: '500px', padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '200px', background: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover' }} />
                <div style={{ padding: '30px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 800 }}>FinFlow Tamil</h3>
                    <span style={{ padding: '4px 12px', background: 'rgba(255,78,205,0.2)', color: '#ff4ecd', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>HOT DEAL</span>
                  </div>
                  <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '20px' }}>
                    <div style={{ width: '70%', height: '100%', background: '#ff4ecd', borderRadius: '10px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Target</div>
                      <div style={{ fontSize: '18px', fontWeight: 800 }}>₹5,00,000</div>
                    </div>
                    <button className="btn-cta-premium" style={{ padding: '10px 24px', fontSize: '13px' }}>View Pitch</button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Trusted By Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginTop: '120px', marginBottom: '60px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', opacity: 0.5, justifyContent: 'center' }}>
              <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, #fff, transparent)' }} />
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em' }}>Trusted by 500+ startups</span>
              <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, #fff, transparent)' }} />
            </div>
            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', justifyContent: 'center', opacity: 0.3 }}>
              {['Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum'].map((l, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.05em', cursor: 'pointer' }}
                >
                  {l}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>
      {/* ══════════════════════════════════════════════════════
          STATS STRIP — INTERACTIVE
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { v: stats.ideas, s: '+', l: 'Ideas Listed', desc: 'Verified concepts ready for funding' },
            { v: stats.funded, s: 'L+', l: 'Lakhs Funded', desc: 'Capital deployed in Tamil Nadu startups' },
            { v: stats.investors, s: '+', l: 'Verified Investors', desc: 'Active angels and venture partners' },
            { v: stats.deals, s: '', l: 'Deals Closed', desc: 'Successful exits and acquisitions' },
          ].map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ flex: 1, minWidth: '200px' }}
            >
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '48px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {s.v.toLocaleString()}{s.s}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '10px', color: '#ff2d95' }}>{s.l}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '5px', fontWeight: 500 }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARQUEE STRIP — CATEGORIES (REDUCED FORMAT)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '15px 0', background: 'rgba(0,0,0,0.8)', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 10 }}>
        <div className="mq-track" style={{ animation: 'marquee 30s linear infinite', display: 'flex', alignItems: 'center' }}>
          {[...categories, ...categories, ...categories, ...categories].map((cat, i) => (
            <motion.span 
              key={i} 
              whileHover={{ color: '#ff2d95' }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 30px', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <span style={{ fontSize: '16px' }}>{cat.icon}</span>
              <span>{cat.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>({cat.count})</span>
            </motion.span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ECOSYSTEM — SCROLLING INTERACTIVE
      ══════════════════════════════════════════════════════ */}
      <section ref={pillarsRef} style={{ padding: '120px 0', background: '#0B0B0F', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 80, textAlign: 'center' }}>
            <p className="section-eyebrow" style={{ justifyContent: 'center' }}>Ecosystem</p>
            <h2 className="premium-font" style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
              One Platform. Every Startup Need.
            </h2>
          </motion.div>

          {/* Image 3 with scrolling animation */}
          <motion.div 
            ref={image3Ref}
            style={{ 
              width: '100%', 
              maxWidth: '1000px', 
              margin: '0 auto 100px', 
              borderRadius: '40px', 
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              scale: image3Scale,
              opacity: image3Opacity,
              rotate: image3Rotate
            }}
          >
            <img 
              src={image3} 
              alt="Startup Ecosystem" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </motion.div>
        </div>

        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
            {pillars.map((p, i) => (
              <motion.div 
                key={`${p.key}-${i}`} 
                className="deal-card" 
                initial={{ opacity: 0, y: 24 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -12, borderColor: 'rgba(255, 45, 149, 0.3)' }}
                style={{ overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                  <motion.img 
                    src={p.img} 
                    alt={p.label} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                    whileHover={{ scale: 1.1, opacity: 1, transition: { duration: 0.6 } }}
                  />
                  <span style={{ position: 'absolute', top: 20, left: 20, background: '#ff2d95', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.badge}</span>
                </div>
                <div style={{ padding: 30 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <span style={{ fontSize: 11, color: '#ff2d95', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{p.label}</span>
                  </div>
                  <h3 className="tesla-font" style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 15, letterSpacing: '-.03em', lineHeight: 1.1 }}>{p.headline.replace('\n', ' ')}</h3>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 25, fontWeight: 500, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{p.desc}</p>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: 30 }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {p.points.slice(0, 3).map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#fff', fontWeight: 600 }}>
                          <span style={{ color: '#ff2d95', fontSize: '16px' }}>✓</span>{pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, background: '#fff', color: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline-hero" 
                    onClick={() => navigate('/register')}
                    style={{ width: '100%', justifyContent: 'center', borderRadius: '16px', padding: '15px' }}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRENDING DEALS
      ══════════════════════════════════════════════════════ */}
      <section ref={marketplaceRef} style={{ padding: '120px 40px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
            <div>
              <p className="section-eyebrow">Marketplace</p>
              <h2 className="tesla-font" style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-.03em', color: '#fff' }}>Trending Deals</h2>
            </div>
            <button className="btn-outline-hero" onClick={() => navigate('/projectpage')}>View All</button>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 30 }}>
            {trendingIdeas.map((idea, i) => (
              <motion.div 
                key={idea.id} 
                className="deal-card" 
                initial={{ opacity: 0, y: 24 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.07 }} 
                whileHover={{ y: -12, borderColor: 'rgba(255, 45, 149, 0.3)' }}
                onClick={() => navigate(`/project/${idea.id}`)}
              >
                <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                  <motion.img 
                    src={idea.img} 
                    alt={idea.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                    whileHover={{ scale: 1.1, opacity: 1, transition: { duration: 0.6 } }}
                  />
                  <span style={{ position: 'absolute', top: 20, left: 20, background: '#ff2d95', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{idea.badge}</span>
                </div>
                <div style={{ padding: 30 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <span style={{ fontSize: 11, color: '#ff2d95', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{idea.category}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 10, padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>{idea.type}</span>
                  </div>
                  <h3 className="tesla-font" style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-.02em' }}>{idea.title}</h3>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 25, fontWeight: 500, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{idea.founder} · {idea.location}</div>
                  
                  <div style={{ display: 'flex', gap: 15, marginBottom: 30 }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5 }}>Price</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{idea.price}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5 }}>Equity</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{idea.equity}</div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02, background: '#fff', color: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline-hero" 
                    style={{ width: '100%', justifyContent: 'center', borderRadius: '16px' }}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
};

export default LandingPage;
