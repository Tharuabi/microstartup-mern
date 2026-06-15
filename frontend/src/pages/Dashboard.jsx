import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import '../style/Dashboard.css';

// --- ICONS ---
const IconLaunch = () => <span style={{ fontSize: '18px' }}>🚀</span>;
const IconFunding = () => <span style={{ fontSize: '18px' }}>💸</span>;
const IconClosed = () => <span style={{ fontSize: '18px' }}>💼</span>;
const IconPending = () => <span style={{ fontSize: '18px' }}>⏳</span>;
const IconTrending = () => <span style={{ fontSize: '18px' }}>🌟</span>;
const IconActivity = () => <span style={{ fontSize: '18px' }}>📊</span>;
const IconNotification = () => <span style={{ fontSize: '18px' }}>🔔</span>;
const IconMonitor = () => <span style={{ fontSize: '18px' }}>🖥️</span>;

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Mock data for charts
  const fundingData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 800 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 1200 },
    { name: 'May', value: 1800 },
    { name: 'Jun', value: 2400 },
  ];

  const marketData = [
    { name: 'SaaS', value: 45 },
    { name: 'Fintech', value: 25 },
    { name: 'AI/ML', value: 20 },
    { name: 'Others', value: 10 },
  ];

  const COLORS = ['#ff4ecd', '#ff85d9', '#f472b6', '#adff2f'];

  const userProjects = [
    { 
      id: 'p1', 
      title: 'EcoFriendly Marketplace', 
      category: 'Web Dev', 
      status: 'Approved', 
      funding: '₹1,200', 
      investors: 3, 
      progress: 85,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'p2', 
      title: 'AI Fitness Coach', 
      category: 'Mobile App', 
      status: 'Approved', 
      funding: '₹950', 
      investors: 2, 
      progress: 60,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'p3', 
      title: 'Indie Game MVP', 
      category: 'Game Dev', 
      status: 'Pending', 
      funding: '₹250', 
      investors: 0, 
      progress: 20,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop'
    },
  ];

  const trendingStartups = [
    { id: 't1', title: 'SolarGrid AI', growth: '+124%', interest: '98%' },
    { id: 't2', title: 'HealthSync', growth: '+85%', interest: '92%' },
    { id: 't3', title: 'FinFlow', growth: '+67%', interest: '88%' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="dashboard-root"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div>
          <h1 className="dashboard-welcome-title">
            Startup <span className="dashboard-user-name">Control Panel</span>
          </h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage your digital assets and funding lifecycle.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="launch-btn" onClick={() => navigate('/add-project')}>
            <IconLaunch /> Launch Startup
          </button>
          <button className="action-btn-small" onClick={() => setShowNotifications(!showNotifications)}>
            <IconNotification />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats-row">
        {[
          { label: 'Active Startups', value: '4', icon: <IconLaunch />, color: 'cyan' },
          { label: 'Deals Closed', value: '12', icon: <IconClosed />, color: 'violet' },
          { label: 'Pending Approvals', value: '2', icon: <IconPending />, color: 'cyan' },
          { label: 'Total Funding', value: '₹2.5L', icon: <IconFunding />, color: 'violet' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            className={`dashboard-stat-card ${stat.color === 'violet' ? 'gradient-purple' : ''}`}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="dashboard-stat-icon">{stat.icon}</div>
            <div className="dashboard-stat-value">{stat.value}</div>
            <div className="dashboard-stat-label">{stat.label}</div>
            <div className="mini-chart" />
          </motion.div>
        ))}
      </div>

      {/* Interactive Monitoring Section */}
      <div className="dashboard-middle-grid">
        <div className="dashboard-panel chart-panel">
          <h3 className="panel-title"><span><IconMonitor /></span> Growth Lifecycle</h3>
          <div className="chart-container-inner">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fundingData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#15151e', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--accent)' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--accent)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-panel chart-panel">
          <h3 className="panel-title"><span><IconTrending /></span> Portfolio Diversification</h3>
          <div className="chart-container-inner">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={marketData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {marketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#15151e', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monitoring Metrics Grid */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card-small">
          <div className="metric-header">
            <span className="metric-dot" style={{ background: '#adff2f' }} />
            <span className="metric-label">NETWORK STABILITY</span>
          </div>
          <div className="metric-value-small">99.98%</div>
          <div className="metric-footer">Real-time status</div>
        </div>
        <div className="metric-card-small">
          <div className="metric-header">
            <span className="metric-dot" style={{ background: '#ff4ecd' }} />
            <span className="metric-label">AVG. DEAL TIME</span>
          </div>
          <div className="metric-value-small">4.2 Days</div>
          <div className="metric-footer">Optimized efficiency</div>
        </div>
        <div className="metric-card-small">
          <div className="metric-header">
            <span className="metric-dot" style={{ background: '#bf97ff' }} />
            <span className="metric-label">CONVERSION RATE</span>
          </div>
          <div className="metric-value-small">18.5%</div>
          <div className="metric-footer">+2.4% this month</div>
        </div>
        <div className="metric-card-small">
          <div className="metric-header">
            <span className="metric-dot" style={{ background: '#00f2ff' }} />
            <span className="metric-label">INVESTOR FLOW</span>
          </div>
          <div className="metric-value-small">₹4.8Cr</div>
          <div className="metric-footer">Active liquidity</div>
        </div>
      </div>

      {/* Projects Cards List */}
      <div className="dashboard-panel">
        <h3 className="panel-title"><span><IconLaunch /></span> Startup Inventory</h3>
        <div className="startup-cards-grid">
          {userProjects.map((p) => (
            <motion.div key={p.id} className="startup-item-card project-card-with-img" whileHover={{ y: -5 }}>
              <div className="project-card-image-wrapper">
                <img src={p.image} alt={p.title} className="project-card-img" />
                <div className="project-card-overlay">
                  <span className={`status-badge-floating ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div className="project-card-content-inner">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 className="startup-card-title">{p.title}</h4>
                  <button className="action-btn-icon-only" onClick={() => navigate('/projectpage')}>↗</button>
                </div>
                <div className="startup-card-category">{p.category}</div>
                
                <div className="progress-info">
                  <span style={{ color: 'var(--text-dim)' }}>Funding Goal</span>
                  <span style={{ color: 'var(--accent-light)' }}>{p.funding}</span>
                </div>
                <div className="metric-bar" style={{ margin: '0 0 16px' }}>
                  <div className="metric-progress" style={{ width: `${p.progress}%` }} />
                </div>
                <div className="project-card-footer">
                  <div className="investor-avatars">
                    {[1,2,3].slice(0, p.investors).map(i => (
                      <div key={i} className="avatar-mini" />
                    ))}
                    {p.investors > 0 && <span className="investor-count">+{p.investors} Investors</span>}
                  </div>
                  <button className="manage-btn-link" onClick={() => navigate('/projectpage')}>Manage</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="notifications-panel"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Live Feed</h4>
              <button onClick={() => setShowNotifications(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div className="notification-item">
              <div className="noti-icon">💰</div>
              <div>
                <div className="noti-title">Investor Interest</div>
                <div className="noti-desc">New offer for "EcoFriendly Marketplace"</div>
              </div>
            </div>
            <div className="notification-item">
              <div className="noti-icon">✨</div>
              <div>
                <div className="noti-title">System Update</div>
                <div className="noti-desc">Your dashboard theme has been upgraded</div>
              </div>
            </div>
            <div className="notification-item">
              <div className="noti-icon">🚀</div>
              <div>
                <div className="noti-title">Launch Alert</div>
                <div className="noti-desc">"FinFlow" just closed its seed round</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
