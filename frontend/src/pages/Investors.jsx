import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaSearch, FaFilter, FaStar, FaChartLine, FaUsers, FaHeart, FaEye, FaShare, FaMoon, FaSun, FaArrowRight } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/Investors.css';

// Import local user assets
import userImage from '../assets/user.jpg';
import user1Image from '../assets/user1.jpg';
import user2Image from '../assets/user2.jpg';
import user3Image from '../assets/user3.jpg';
import user4Image from '../assets/user4.jpg';
import image3Image from '../assets/image3.jpg';
import image2Image from '../assets/image2.jpg.jpg';

const Investors = () => {
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

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

  const investors = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Angel Investor & Startup Advisor",
      bio: "Former VP at TechCorp with 15+ years in tech investments. Passionate about AI and sustainable tech startups.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
      category: "Angel Investor",
      totalInvested: 2500000,
      activeInvestments: 12,
      successRate: 85,
      rating: 4.9,
      specialties: ["AI/ML", "SaaS", "FinTech"],
      location: "San Francisco, CA",
      verified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      title: "Venture Capital Partner",
      bio: "Ex-Google engineer turned VC. Focuses on early-stage tech startups with strong technical foundations.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      category: "VC Partner",
      totalInvested: 15000000,
      activeInvestments: 8,
      successRate: 92,
      rating: 4.8,
      specialties: ["Deep Tech", "Enterprise SaaS", "Developer Tools"],
      location: "New York, NY",
      verified: true
    },
    {
      id: 3,
      name: "Emma Davis",
      title: "Micro-Startup Specialist",
      bio: "Former startup founder who understands the challenges of early-stage companies. Invests in passionate founders.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
      category: "Micro Investor",
      totalInvested: 500000,
      activeInvestments: 25,
      successRate: 78,
      rating: 4.7,
      specialties: ["Consumer Apps", "Marketplace", "EdTech"],
      location: "Austin, TX",
      verified: true
    },
    {
      id: 4,
      name: "Alex Rivera",
      title: "Blockchain & Web3 Investor",
      bio: "Early crypto adopter and Web3 enthusiast. Invests in innovative blockchain and decentralized applications.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      category: "Web3 Investor",
      totalInvested: 3000000,
      activeInvestments: 15,
      successRate: 88,
      rating: 4.6,
      specialties: ["DeFi", "NFTs", "Infrastructure"],
      location: "Miami, FL",
      verified: true
    },
    {
      id: 5,
      name: "Lisa Wang",
      title: "Sustainable Tech Investor",
      bio: "Environmental scientist turned investor. Focuses on startups solving climate change and sustainability challenges.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
      category: "Impact Investor",
      totalInvested: 800000,
      activeInvestments: 18,
      successRate: 82,
      rating: 4.8,
      specialties: ["Clean Energy", "Circular Economy", "Green Tech"],
      location: "Portland, OR",
      verified: true
    },
    {
      id: 6,
      name: "David Kim",
      title: "Healthcare & Biotech Investor",
      bio: "Medical professional with investment experience in healthcare startups. Passionate about improving patient outcomes.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      category: "Healthcare Investor",
      totalInvested: 1200000,
      activeInvestments: 10,
      successRate: 90,
      rating: 4.9,
      specialties: ["Digital Health", "MedTech", "Biotech"],
      location: "Boston, MA",
      verified: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Investors' },
    { id: 'Angel Investor', name: 'Angel Investors' },
    { id: 'VC Partner', name: 'VC Partners' },
    { id: 'Micro Investor', name: 'Micro Investors' },
    { id: 'Web3 Investor', name: 'Web3 Investors' },
    { id: 'Impact Investor', name: 'Impact Investors' },
    { id: 'Healthcare Investor', name: 'Healthcare Investors' }
  ];

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'all' || investor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="investors-page" data-theme={theme}>
      {/* Header */}
      <header className="investors-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="header-title">Find Investors</h1>
            <p className="header-subtitle">Connect with experienced investors who can help grow your startup</p>
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

      {/* Search and Filters */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search investors by name, specialty, or location..."
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
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="invested">Most Invested</option>
                <option value="success">Success Rate</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Investors Grid */}
      <section className="investors-section">
        <div className="investors-container">
          <div className="investors-grid">
            {filteredInvestors.map((investor, index) => (
              <div 
                key={investor.id} 
                className="investor-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="card-header">
                  <div className="investor-avatar">
                    <img src={investor.avatar} alt={investor.name} />
                    {investor.verified && (
                      <div className="verified-badge">
                        <FaStar />
                      </div>
                    )}
                  </div>
                  <div className="investor-info">
                    <h3 className="investor-name">{investor.name}</h3>
                    <p className="investor-title">{investor.title}</p>
                    <div className="investor-rating">
                      <FaStar className="star-icon" />
                      <span>{investor.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <p className="investor-bio">{investor.bio}</p>
                  
                  <div className="investor-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Invested</span>
                      <span className="stat-value">${(investor.totalInvested / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Active Investments</span>
                      <span className="stat-value">{investor.activeInvestments}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Success Rate</span>
                      <span className="stat-value">{investor.successRate}%</span>
                    </div>
                  </div>

                  <div className="investor-specialties">
                    <h4>Specialties:</h4>
                    <div className="specialties-list">
                      {investor.specialties.map((specialty, specIndex) => (
                        <span key={specIndex} className="specialty-tag">{specialty}</span>
                      ))}
                    </div>
                  </div>

                  <div className="investor-location">
                    <span className="location-text">{investor.location}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="action-buttons">
                    <button className="action-btn">
                      <FaHeart />
                    </button>
                    <button className="action-btn">
                      <FaShare />
                    </button>
                    <button className="action-btn">
                      <FaEye />
                    </button>
                  </div>
                  <Link to={`/investor/${investor.id}`} className="view-profile-btn">
                    View Profile
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredInvestors.length === 0 && (
            <div className="no-results">
              <h3>No investors found</h3>
              <p>Try adjusting your search criteria or browse all categories</p>
            </div>
          )}
        </div>
      </section>

      {/* Trusted by Founders Worldwide Section */}
      <section className="trusted-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Trusted by Founders Worldwide</h2>
            <p className="section-subtitle">Join thousands of successful entrepreneurs who've built their dreams with MicroStartupX</p>
          </div>
          <div className="trusted-content" data-aos="fade-up" data-aos-delay="200">
                                                                                                                                                                                                               <div className="trusted-logos">
                 <div className="trusted-logo" data-aos="fade-up" data-aos-delay="100">
                   <img src={userImage} alt="Startup Founder 1" />
                 </div>
                 <div className="trusted-logo" data-aos="fade-up" data-aos-delay="200">
                   <img src={user1Image} alt="Startup Founder 2" />
                 </div>
                                   <div className="trusted-logo" data-aos="fade-up" data-aos-delay="300">
                    <img src={user2Image} alt="Startup Founder 3" />
                  </div>
                  <div className="trusted-logo" data-aos="fade-up" data-aos-delay="400">
                    <img src={user3Image} alt="Startup Founder 4" />
                  </div>
                                   <div className="trusted-logo" data-aos="fade-up" data-aos-delay="500">
                    <img src={user4Image} alt="Startup Founder 5" />
                  </div>
                 <div className="trusted-logo" data-aos="fade-up" data-aos-delay="600">
                   <img src={image2Image} alt="Startup Founder 6" />
                 </div>
                 
               </div>
            <div className="trusted-stats">
              <div className="trusted-stat" data-aos="fade-up" data-aos-delay="700">
                <div className="trusted-stat-number">150+</div>
                <div className="trusted-stat-label">Countries</div>
              </div>
              <div className="trusted-stat" data-aos="fade-up" data-aos-delay="800">
                <div className="trusted-stat-number">25+</div>
                <div className="trusted-stat-label">Languages</div>
              </div>
              <div className="trusted-stat" data-aos="fade-up" data-aos-delay="900">
                <div className="trusted-stat-number">98%</div>
                <div className="trusted-stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content" data-aos="fade-up">
            <h2 className="cta-title">Ready to Connect?</h2>
            <p className="cta-description">
              Join thousands of startups who have found their perfect investor match on MicroStartupX.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">List Your Startup</Link>
              <Link to="/projects" className="cta-btn secondary">Browse Projects</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Investors; 