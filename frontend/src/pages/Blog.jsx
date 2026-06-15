import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaSearch, FaCalendar, FaUser, FaEye, FaHeart, FaShare, FaMoon, FaSun, FaArrowRight } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/Blog.css';

const Blog = () => {
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Micro-Startup Investing in 2024",
      excerpt: "Discover the latest trends and opportunities in micro-startup investing, from AI-powered platforms to sustainable tech investments.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Investment Trends",
      readTime: "5 min read",
      views: 1247,
      likes: 89,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      featured: true
    },
    {
      id: 2,
      title: "How to Evaluate Startup Potential: A Complete Guide",
      excerpt: "Learn the essential metrics and frameworks for evaluating startup potential and making informed investment decisions.",
      author: "Mike Chen",
      date: "2024-01-12",
      category: "Investment Guide",
      readTime: "8 min read",
      views: 2156,
      likes: 156,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400"
    },
    {
      id: 3,
      title: "Sustainable Tech: The Next Big Investment Opportunity",
      excerpt: "Why green technology startups are attracting record investments and how to identify the best opportunities.",
      author: "Emma Davis",
      date: "2024-01-10",
      category: "Green Tech",
      readTime: "6 min read",
      views: 1893,
      likes: 134,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400"
    },
    {
      id: 4,
      title: "Web3 Startups: Opportunities and Risks in 2024",
      excerpt: "A comprehensive analysis of Web3 and blockchain startup opportunities, including risk assessment and due diligence.",
      author: "Alex Rivera",
      date: "2024-01-08",
      category: "Web3",
      readTime: "7 min read",
      views: 1678,
      likes: 98,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400"
    },
    {
      id: 5,
      title: "Building a Successful Startup Pitch Deck",
      excerpt: "Essential tips and templates for creating compelling pitch decks that attract investor attention and funding.",
      author: "Sarah Johnson",
      date: "2024-01-05",
      category: "Startup Guide",
      readTime: "10 min read",
      views: 2341,
      likes: 187,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
    },
    {
      id: 6,
      title: "The Rise of AI in Startup Investment Decisions",
      excerpt: "How artificial intelligence is revolutionizing the way investors discover and evaluate startup opportunities.",
      author: "Mike Chen",
      date: "2024-01-03",
      category: "AI & ML",
      readTime: "9 min read",
      views: 1987,
      likes: 145,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Investment Trends', name: 'Investment Trends' },
    { id: 'Investment Guide', name: 'Investment Guide' },
    { id: 'Green Tech', name: 'Green Tech' },
    { id: 'Web3', name: 'Web3 & Blockchain' },
    { id: 'Startup Guide', name: 'Startup Guide' },
    { id: 'AI & ML', name: 'AI & Machine Learning' }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="blog-page" data-theme={theme}>
      {/* Header */}
      <header className="blog-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="header-title">Blog & Insights</h1>
            <p className="header-subtitle">Stay updated with the latest trends and insights in startup investing</p>
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
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="featured-section">
          <div className="featured-container">
            <div className="featured-card" data-aos="fade-up">
              <div className="featured-image">
                <img src={featuredPost.image} alt={featuredPost.title} />
                <div className="featured-overlay">
                  <span className="featured-badge">Featured</span>
                </div>
              </div>
              <div className="featured-content">
                <div className="post-meta">
                  <span className="post-category">{featuredPost.category}</span>
                  <span className="post-date">
                    <FaCalendar />
                    {featuredPost.date}
                  </span>
                </div>
                <h2 className="featured-title">{featuredPost.title}</h2>
                <p className="featured-excerpt">{featuredPost.excerpt}</p>
                <div className="featured-footer">
                  <div className="author-info">
                    <FaUser />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="post-stats">
                    <span><FaEye /> {featuredPost.views}</span>
                    <span><FaHeart /> {featuredPost.likes}</span>
                  </div>
                </div>
                <Link to={`/blog/${featuredPost.id}`} className="read-more-btn">
                  Read Full Article
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="posts-section">
        <div className="posts-container">
          <div className="posts-grid">
            {regularPosts.map((post, index) => (
              <article 
                key={post.id} 
                className="blog-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="card-image">
                  <img src={post.image} alt={post.title} />
                  <div className="card-overlay">
                    <button className="overlay-btn">
                      <FaHeart />
                    </button>
                    <button className="overlay-btn">
                      <FaShare />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">
                      <FaCalendar />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-footer">
                    <div className="author-info">
                      <FaUser />
                      <span>{post.author}</span>
                    </div>
                    <div className="post-stats">
                      <span><FaEye /> {post.views}</span>
                      <span><FaHeart /> {post.likes}</span>
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`} className="read-more-link">
                    Read More
                    <FaArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="no-results">
              <h3>No articles found</h3>
              <p>Try adjusting your search criteria or browse all categories</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog; 