import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useCart } from '../context/CartContext';
import Chatbot from '../components/Chatbot';
import '../style/ProjectPage.css';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [quickFilters, setQuickFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [techFilter, setTechFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [userRatings, setUserRatings] = useState({});


  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  // Generate enhanced placeholder image with category-specific designs
  const generateProjectImage = (project) => {
    // For now, we'll use enhanced placeholders instead of external screenshot services
    // This avoids timeout issues and provides consistent, reliable images
    
    // Fallback to enhanced placeholder with category-specific designs
    const getCategoryTheme = (cat) => {
      const category = cat.toLowerCase();
      if (category.includes('saas') || category.includes('software')) {
        return { bg: '#3b82f6', icon: '☁️', accent: '#1d4ed8' };
      } else if (category.includes('mobile') || category.includes('app')) {
        return { bg: '#10b981', icon: '📱', accent: '#059669' };
      } else if (category.includes('web3') || category.includes('blockchain')) {
        return { bg: '#8b5cf6', icon: '🔗', accent: '#7c3aed' };
      } else if (category.includes('ecommerce') || category.includes('shop')) {
        return { bg: '#f59e0b', icon: '🛒', accent: '#d97706' };
      } else if (category.includes('ai') || category.includes('machine learning')) {
        return { bg: '#ef4444', icon: '🤖', accent: '#dc2626' };
      } else if (category.includes('social') || category.includes('community')) {
        return { bg: '#ec4899', icon: '👥', accent: '#db2777' };
      } else if (category.includes('finance') || category.includes('payment')) {
        return { bg: '#06b6d4', icon: '💰', accent: '#0891b2' };
      } else {
        return { bg: '#667eea', icon: '🚀', accent: '#5a67d8' };
      }
    };

    const theme = getCategoryTheme(project.category);
    const shortTitle = project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title;
    
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#111;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <rect width="400" height="300" fill="url(#grad1)" rx="24"/>
        <rect width="400" height="300" fill="rgba(255,255,255,0.03)" rx="24"/>
        <rect width="398" height="298" x="1" y="1" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" rx="24"/>
        
        <circle cx="200" cy="120" r="60" fill="${theme.bg}" fill-opacity="0.15" filter="url(#glow)"/>
        <text x="200" y="130" font-family="Outfit, Arial" font-size="64" 
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${theme.icon}
        </text>
        
        <text x="200" y="210" font-family="Outfit, Arial" font-size="22" font-weight="800"
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${shortTitle}
        </text>
        
        <text x="200" y="245" font-family="Outfit, Arial" font-size="14" font-weight="600"
              fill="rgba(255,255,255,0.4)" text-anchor="middle" dominant-baseline="middle" text-transform="uppercase" letter-spacing="2">
          ${project.category || 'STARTUP'}
        </text>
      </svg>
    `;
    
    // Use proper encoding for Unicode characters
    const encodedSvg = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${encodedSvg}`;
  };

  // Generate enhanced placeholder image with category-specific designs (for ideas)
  const generatePlaceholder = (title, type = 'project', category = '') => {
    // Determine category-specific colors and icons
    const getCategoryTheme = (cat) => {
      const category = cat.toLowerCase();
      if (category.includes('saas') || category.includes('software')) {
        return { bg: '#3b82f6', icon: '☁️', accent: '#1d4ed8' };
      } else if (category.includes('mobile') || category.includes('app')) {
        return { bg: '#10b981', icon: '📱', accent: '#059669' };
      } else if (category.includes('web3') || category.includes('blockchain')) {
        return { bg: '#8b5cf6', icon: '🔗', accent: '#7c3aed' };
      } else if (category.includes('ecommerce') || category.includes('shop')) {
        return { bg: '#f59e0b', icon: '🛒', accent: '#d97706' };
      } else if (category.includes('ai') || category.includes('machine learning')) {
        return { bg: '#ef4444', icon: '🤖', accent: '#dc2626' };
      } else if (category.includes('social') || category.includes('community')) {
        return { bg: '#ec4899', icon: '👥', accent: '#db2777' };
      } else if (category.includes('finance') || category.includes('payment')) {
        return { bg: '#06b6d4', icon: '💰', accent: '#0891b2' };
      } else {
        return { bg: '#667eea', icon: '🚀', accent: '#5a67d8' };
      }
    };

    const theme = getCategoryTheme(category);
    const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
    
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#111;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <rect width="400" height="300" fill="url(#grad1)" rx="24"/>
        <rect width="400" height="300" fill="rgba(255,255,255,0.03)" rx="24"/>
        <rect width="398" height="298" x="1" y="1" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" rx="24"/>
        
        <circle cx="200" cy="120" r="60" fill="${theme.bg}" fill-opacity="0.15" filter="url(#glow)"/>
        <text x="200" y="130" font-family="Outfit, Arial" font-size="64" 
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${theme.icon}
        </text>
        
        <text x="200" y="210" font-family="Outfit, Arial" font-size="22" font-weight="800"
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${shortTitle}
        </text>
        
        <text x="200" y="245" font-family="Outfit, Arial" font-size="14" font-weight="600"
              fill="rgba(255,255,255,0.4)" text-anchor="middle" dominant-baseline="middle" text-transform="uppercase" letter-spacing="2">
          ${category || 'IDEA'}
        </text>
      </svg>
    `;
    
    // Use proper encoding for Unicode characters
    const encodedSvg = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${encodedSvg}`;
  };

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [projectsRes, ideasRes] = await Promise.all([
        api.get('/api/projects'),
        api.get('/api/ideas')
      ]);
      setProjects(projectsRes.data);
      setIdeas(ideasRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load projects and ideas');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh trending data every 45 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 45000); // 45 seconds
    return () => clearInterval(interval);
  }, []);

  // Track project view
  const trackProjectView = async (projectId) => {
    try {
      await api.put(`/api/projects/${projectId}/view`);
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };



  // Handle idea like
  const handleLikeIdea = async (ideaId) => {
    try {
      const response = await api.put(`/api/ideas/${ideaId}/like`);
      if (response.data.success) {
        setIdeas(prev => prev.map(idea => 
          idea._id === ideaId 
            ? { ...idea, likes: response.data.newLikes }
            : idea
        ));
      }
    } catch (err) {
      console.error('Error liking idea:', err);
    }
  };

  // Handle project view
  const handleProjectView = async (projectId) => {
    try {
      await trackProjectView(projectId);
    } finally {
      navigate(`/project/${projectId}`);
    }
  };

  // Handle user rating
  const handleUserRating = (projectId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [projectId]: rating
    }));
  };

  // Quick filter options
  const quickFilterOptions = [
    { value: 'under50k', label: 'Under ₹50K', icon: '💰' },
    { value: 'saas', label: 'SaaS', icon: '☁️' },
    { value: 'mobile', label: 'Mobile App', icon: '📱' },
    { value: 'web3', label: 'Web3', icon: '🔗' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒' }
  ];

          // Category navigation options - Modern Startup Categories
        const categoryOptions = [
          { value: 'all', label: 'All', icon: '🏠' },
          { value: 'saas', label: 'SaaS', icon: '☁️' },
          { value: 'mobile', label: 'Mobile', icon: '📱' },
          { value: 'web3', label: 'Web3', icon: '🔗' },
          { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
          { value: 'electronics', label: 'Electronics', icon: '📺' },
          { value: 'fashion', label: 'Fashion', icon: '👕' },
          { value: 'beauty', label: 'Beauty', icon: '💄' },
          { value: 'home', label: 'Home', icon: '🏡' }
        ];

  const ideaQuickFilterOptions = [
    { value: 'beginner', label: 'Beginner', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', icon: '🚀' },
    { value: 'advanced', label: 'Advanced', icon: '⚡' },
    { value: 'ai', label: 'AI/ML', icon: '🤖' },
    { value: 'fintech', label: 'FinTech', icon: '💳' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Toggle quick filter
  const toggleQuickFilter = (filter) => {
    setQuickFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQuickFilters([]);
    setSearchTerm('');
  };

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = quickFilters.length === 0 || 
        quickFilters.some(filter => {
          switch (filter) {
            case 'under50k': return project.price < 50000;
            case 'saas': return project.category.toLowerCase().includes('saas');
            case 'app': return project.category.toLowerCase().includes('app');
            case 'web3': return project.category.toLowerCase().includes('web3');
            case 'ecommerce': return project.category.toLowerCase().includes('ecommerce');
            default: return true;
          }
        });
      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'rating': return b.rating - a.rating;
        case 'views': return b.views - a.views;
        case 'dateAdded': return new Date(b.dateAdded) - new Date(a.dateAdded);
        default: return 0;
      }
    });

  // Filter and sort ideas
  const filteredAndSortedIdeas = ideas
    .filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = quickFilters.length === 0 || 
        quickFilters.some(filter => {
          switch (filter) {
            case 'beginner': return idea.difficulty === 'Beginner';
            case 'intermediate': return idea.difficulty === 'Intermediate';
            case 'advanced': return idea.difficulty === 'Advanced';
            case 'ai': return idea.category.toLowerCase().includes('ai');
            case 'fintech': return idea.category.toLowerCase().includes('fintech');
            default: return true;
          }
        });
      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'estimatedCost': return a.estimatedCost - b.estimatedCost;
        case 'likes': return b.likes - a.likes;
        case 'views': return b.views - a.views;
        case 'dateAdded': return new Date(b.dateAdded) - new Date(a.dateAdded);
        default: return 0;
      }
    });

  // Get trending projects (top 6 by views and rating)
  const trendingProjects = projects
    .filter(project => project.trending || project.views > 100)
    .sort((a, b) => (b.views * b.rating) - (a.views * a.rating))
    .slice(0, 6);

  // Get trending ideas (top 3 by likes and views)
  const trendingIdeas = ideas
    .filter(idea => idea.trending || idea.likes > 10)
    .sort((a, b) => (b.likes * b.views) - (a.likes * a.views))
    .slice(0, 3);

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    totalIdeas: ideas.length,
    trendingProjects: trendingProjects.length,
    trendingIdeas: trendingIdeas.length,
    avgProjectPrice: projects.length > 0 ? projects.reduce((sum, p) => sum + p.price, 0) / projects.length : 0,
    avgIdeaCost: ideas.length > 0 ? ideas.reduce((sum, i) => sum + i.estimatedCost, 0) / ideas.length : 0
  };

  const handleAddToCart = (project) => {
    addToCart(project);
  };

  // Icons
  const SearchIcon = () => <span className="pp-icon-search">🔍</span>;
  const StarIcon = () => <span className="pp-icon">⭐</span>;
  const EyeIcon = () => <span className="pp-icon">👁️</span>;
  const HeartIcon = () => <span className="pp-icon-heart">❤️</span>;
  const TrendingIcon = () => <span className="pp-icon">🔥</span>;
  const LightbulbIcon = () => <span className="pp-icon-lightbulb">💡</span>;
  const ClockIcon = () => <span className="pp-icon">⏰</span>;
  const LinkIcon = () => <span className="pp-icon">🔗</span>;

  if (isLoading) {
    return (
      <div className="project-page">
        <div className="pp-loading">
          <div className="pp-spinner"></div>
          <p>Loading amazing projects and ideas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-page">
        <div className="pp-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-page">
      <Chatbot />
      
      {/* Search & Filter Section */}
      <div className="pp-search-container">
        <div className="pp-search-box">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by name, category, tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pp-search-input"
          />
        </div>

        <div className="pp-filter-controls">
          <div className="pp-filter-group">
            <select 
              className="pp-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Top Rated</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          <div className="pp-tab-toggle">
            <button 
              className={`pp-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              🚀 Projects
            </button>
            <button 
              className={`pp-tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
              onClick={() => setActiveTab('ideas')}
            >
              💡 Ideas
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="pp-results-container">
        <div className="pp-content-grid">
          {activeTab === 'projects' ? (
            filteredAndSortedProjects.map(project => (
              <div key={project._id} className="pp-project-card" onClick={() => handleProjectView(project._id)}>
                <div className="pp-project-image">
                  <img 
                    src={project.imageUrl || generateProjectImage(project)} 
                    alt={project.title}
                    onError={(e) => {
                      e.target.src = generatePlaceholder(project.title, 'project', project.category);
                    }}
                  />
                  <div className="pp-card-badge">🔥 Trending</div>
                </div>
                
                <div className="pp-project-content">
                  <div className="pp-card-header">
                    <span className="pp-category-tag">{project.category}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <p>{project.shortDescription}</p>
                  
                  <div className="pp-card-footer">
                    <div className="pp-price-section">
                      <span className="pp-price">₹{project.price.toLocaleString('en-IN')}</span>
                      <div className="pp-rating">
                        <StarIcon /> {project.rating.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="pp-card-actions">
                      <button 
                        className="pp-cart-btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(project);
                        }}
                      >
                        🛒 Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredAndSortedIdeas.map(idea => (
              <div key={idea._id} className="pp-idea-card" onClick={() => navigate(`/idea/${idea._id}`)}>
                <div className="pp-idea-image">
                  <img 
                    src={idea.imageUrl || generatePlaceholder(idea.title, 'idea', idea.category)} 
                    alt={idea.title}
                    onError={(e) => {
                      e.target.src = generatePlaceholder(idea.title, 'idea', idea.category);
                    }}
                  />
                  <div className={`pp-difficulty-badge ${idea.difficulty.toLowerCase()}`}>
                    {idea.difficulty}
                  </div>
                </div>
                
                <div className="pp-idea-content">
                  <div className="pp-card-header">
                    <span className="pp-category-tag">{idea.category}</span>
                    <h3>{idea.title}</h3>
                  </div>
                  <p>{idea.description.substring(0, 100)}...</p>
                  
                  <div className="pp-card-footer">
                    <div className="pp-stats-section">
                      <div className="pp-stat">
                        <HeartIcon /> {idea.likes}
                      </div>
                      <div className="pp-stat">
                        <EyeIcon /> {idea.views}
                      </div>
                    </div>
                    
                    <button 
                      className="pp-view-roadmap-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/idea/${idea._id}`);
                      }}
                    >
                      Roadmap →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {((activeTab === 'projects' && filteredAndSortedProjects.length === 0) ||
          (activeTab === 'ideas' && filteredAndSortedIdeas.length === 0)) && (
          <div className="pp-empty-state">
            <div className="pp-empty-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="pp-clear-btn" onClick={clearAllFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;