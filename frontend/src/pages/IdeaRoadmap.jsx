import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import '../style/IdeaRoadmap.css';

const IdeaRoadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await api.get(`/api/ideas/${id}`);
        setIdea(response.data);
        setLoading(false);
        // Increment views
        await api.put(`/api/ideas/${id}/view`);
      } catch (err) {
        console.error('Error fetching idea:', err);
        setError('Idea not found or server error');
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  if (loading) return (
    <div className="roadmap-loading">
      <div className="spinner"></div>
      <p>Building Roadmap...</p>
    </div>
  );

  if (error || !idea) return (
    <div className="roadmap-error">
      <h2>Error</h2>
      <p>{error || 'Idea not found'}</p>
      <button onClick={() => navigate('/projectpage')}>Back to Ideas</button>
    </div>
  );

  const roadmapSteps = [
    {
      title: 'Foundation & Research',
      desc: idea.problem,
      icon: '🔍',
      status: 'completed'
    },
    {
      title: 'Solution Design',
      desc: idea.solution,
      icon: '💡',
      status: 'active'
    },
    {
      title: 'Tech Stack & Architecture',
      desc: idea.techStack.join(', '),
      icon: '⚙️',
      status: 'pending'
    },
    {
      title: 'Market Entry Strategy',
      desc: idea.targetMarket,
      icon: '🚀',
      status: 'pending'
    },
    {
      title: 'Revenue Generation',
      desc: idea.revenueModel,
      icon: '💰',
      status: 'pending'
    }
  ];

  return (
    <div className="idea-roadmap-page">
      <div className="roadmap-container">
        {/* Header Section */}
        <motion.div 
          className="roadmap-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-badge">{idea.category}</div>
          <h1>{idea.title}</h1>
          <p className="idea-main-desc">{idea.description}</p>
          
          <div className="idea-stats-bar">
            <div className="stat-pill">
              <span className="stat-label">Est. Cost</span>
              <span className="stat-value">₹{idea.estimatedCost.toLocaleString()}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Timeline</span>
              <span className="stat-value">{idea.timeline}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Difficulty</span>
              <span className={`difficulty-val ${idea.difficulty.toLowerCase()}`}>{idea.difficulty}</span>
            </div>
          </div>
        </motion.div>

        {/* Visual Roadmap Section */}
        <div className="roadmap-visual-section">
          <h2 className="section-title">Execution Roadmap</h2>
          <div className="roadmap-timeline">
            {roadmapSteps.map((step, index) => (
              <motion.div 
                key={index}
                className={`roadmap-step ${step.status}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="step-icon-wrapper">
                  <div className="step-icon">{step.icon}</div>
                  {index < roadmapSteps.length - 1 && <div className="step-connector"></div>}
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="roadmap-actions">
          <button className="back-btn" onClick={() => navigate('/projectpage')}>
            ← Back to Explore
          </button>
          <button className="launch-btn" onClick={() => navigate('/add-project')}>
            Launch this Project 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaRoadmap;
