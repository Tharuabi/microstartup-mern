import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaLightbulb, FaStore, FaChartLine, FaSearch, FaFilter, FaHeart, FaEye, FaShare, FaStar, FaMoon, FaSun } from 'react-icons/fa';
import { MdLanguage, MdNotifications } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/Projects.css';

const Projects = () => {
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const projects = [
    {
      id: 1,
      title: "AI-Powered Healthcare Platform",
      description: "Revolutionary healthcare platform using AI to diagnose and treat patients remotely.",
      category: "AI & ML",
      fundingGoal: 500000,
      currentFunding: 350000,
      investors: 45,
      daysLeft: 12,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      tags: ["Healthcare", "AI", "Remote Care"],
      rating: 4.8
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions",
      description: "Innovative solar panel technology that increases efficiency by 40%.",
      category: "Green Tech",
      fundingGoal: 750000,
      currentFunding: 520000,
      investors: 78,
      daysLeft: 8,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
      tags: ["Renewable Energy", "Solar", "Sustainability"],
      rating: 4.9
    },
    {
      id: 3,
      title: "Blockchain Supply Chain",
      description: "Transparent supply chain management using blockchain technology.",
      category: "Web3",
      fundingGoal: 300000,
      currentFunding: 180000,
      investors: 32,
      daysLeft: 15,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
      tags: ["Blockchain", "Supply Chain", "Transparency"],
      rating: 4.6
    },
    {
      id: 4,
      title: "EdTech Learning Platform",
      description: "Personalized learning platform using adaptive AI algorithms.",
      category: "Education",
      fundingGoal: 400000,
      currentFunding: 280000,
      investors: 56,
      daysLeft: 20,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      tags: ["Education", "AI", "Personalization"],
      rating: 4.7
    },
    {
      id: 5,
      title: "Smart Home Security",
      description: "Advanced home security system with facial recognition and AI monitoring.",
      category: "IoT",
      fundingGoal: 600000,
      currentFunding: 420000,
      investors: 67,
      daysLeft: 10,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      tags: ["Security", "IoT", "AI"],
      rating: 4.5
    },
    {
      id: 6,
      title: "Eco-Friendly Packaging",
      description: "Biodegradable packaging solutions for sustainable business practices.",
      category: "Green Tech",
      fundingGoal: 250000,
      currentFunding: 190000,
      investors: 41,
      daysLeft: 18,
      image: "https://images.unsplash.com/photo-1602928320820-203cbd7c1de4?w=400",
      tags: ["Packaging", "Sustainability", "Biodegradable"],
      rating: 4.8
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: <FaRocket /> },
    { id: 'AI & ML', name: 'AI & Machine Learning', icon: <FaLightbulb /> },
    { id: 'Green Tech', name: 'Green Technology', icon: <FaStore /> },
    { id: 'Web3', name: 'Web3 & Blockchain', icon: <FaChartLine /> },
    { id: 'Education', name: 'Education Tech', icon: <FaRocket /> },
    { id: 'IoT', name: 'Internet of Things', icon: <FaLightbulb /> }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFundingPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="projects-page" data-theme={theme}>
      {/* Header */}
      <header className="projects-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="header-title">Discover Amazing Projects</h1>
            <p className="header-subtitle">Invest in innovative startups that are shaping the future</p>
          </div>
          
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <button className="notification-btn">
              <MdNotifications />
            </button>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="category-filter">
              <FaFilter className="filter-icon" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sort-filter">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="funding">Most Funded</option>
                <option value="ending">Ending Soon</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="projects-section">
        <div className="projects-container">
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="project-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <button className="overlay-btn">
                      <FaHeart />
                    </button>
                    <button className="overlay-btn">
                      <FaEye />
                    </button>
                    <button className="overlay-btn">
                      <FaShare />
                    </button>
                  </div>
                </div>

                <div className="project-content">
                  <div className="project-category">{project.category}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-tags">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="project-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="project-stats">
                    <div className="funding-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${getFundingPercentage(project.currentFunding, project.fundingGoal)}%` }}
                        ></div>
                      </div>
                      <div className="funding-info">
                        <span className="funding-amount">${project.currentFunding.toLocaleString()}</span>
                        <span className="funding-goal">of ${project.fundingGoal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="project-meta">
                      <div className="meta-item">
                        <span className="meta-label">Investors</span>
                        <span className="meta-value">{project.investors}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Days Left</span>
                        <span className="meta-value">{project.daysLeft}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Rating</span>
                        <span className="meta-value">
                          <FaStar className="star-icon" />
                          {project.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/project/${project.id}`} className="view-project-btn">
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="no-results">
              <h3>No projects found</h3>
              <p>Try adjusting your search criteria or browse all categories</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects; 