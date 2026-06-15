import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaUsers, FaChartLine, FaHeart, FaStar, FaMoon, FaSun, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/About.css';

// Import local user assets
import userImage from '../assets/user.jpg';
import user1Image from '../assets/user1.jpg';
import user2Image from '../assets/user2.jpg';
import user3Image from '../assets/user3.jpg';
import user4Image from '../assets/user4.jpg';
import image3Image from '../assets/image3.jpg';
import image2Image from '../assets/image2.jpg.jpg';

const About = () => {
  const [theme, setTheme] = useState('light');

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

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
      bio: "Former VP at TechCorp, passionate about democratizing startup investment.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Mike Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      bio: "Ex-Google engineer with 15+ years in AI and blockchain technology.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Emma Davis",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
      bio: "Former startup founder, expert in scaling operations and investor relations.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Alex Rivera",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      bio: "Product leader with experience at Stripe and Airbnb, focused on user experience.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    }
  ];

  const stats = [
    { number: "1000+", label: "Projects Funded", icon: <FaRocket /> },
    { number: "800+", label: "Active Investors", icon: <FaUsers /> },
    { number: "$50M+", label: "Total Funding", icon: <FaChartLine /> },
    { number: "4.9", label: "Platform Rating", icon: <FaStar /> }
  ];

  const values = [
    {
      title: "Transparency",
      description: "We believe in complete transparency in all our operations and investment processes.",
      icon: <FaHeart />
    },
    {
      title: "Innovation",
      description: "We constantly innovate to provide the best platform for startups and investors.",
      icon: <FaRocket />
    },
    {
      title: "Community",
      description: "Building a strong community of investors and entrepreneurs who support each other.",
      icon: <FaUsers />
    },
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from platform features to customer service.",
      icon: <FaStar />
    }
  ];

  return (
    <div className="about-page" data-theme={theme}>
      {/* Header */}
      <header className="about-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="header-title">About MicroStartupX</h1>
            <p className="header-subtitle">Connecting innovative startups with passionate investors since 2020</p>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content" data-aos="fade-up">
            <h2 className="hero-title">Our Mission</h2>
            <p className="hero-description">
              At MicroStartupX, we believe that great ideas deserve great support. Our platform 
              democratizes startup investment, making it accessible to everyone while providing 
              innovative startups with the funding they need to grow and succeed.
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="value-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">The passionate people behind MicroStartupX</p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="team-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                  <div className="member-overlay">
                    <div className="social-links">
                      <a href={member.social.twitter} className="social-link">
                        <FaTwitter />
                      </a>
                      <a href={member.social.linkedin} className="social-link">
                        <FaLinkedin />
                      </a>
                      <a href={member.social.github} className="social-link">
                        <FaGithub />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content" data-aos="fade-up">
            <h2 className="story-title">Our Story</h2>
            <div className="story-text">
              <p>
                MicroStartupX was born from a simple observation: brilliant startup ideas were 
                failing not because they lacked potential, but because they couldn't access the 
                right investors. Traditional investment platforms were exclusive, expensive, and 
                often inaccessible to the average investor.
              </p>
              <p>
                In 2020, our founder Sarah Johnson, a former VP at TechCorp, decided to change 
                this. She assembled a team of industry veterans from companies like Google, 
                Stripe, and Airbnb to build a platform that would democratize startup investment.
              </p>
              <p>
                Today, MicroStartupX has helped over 1,000 startups raise more than $50 million 
                in funding, while providing 800+ investors with access to innovative investment 
                opportunities. We're just getting started.
              </p>
            </div>
          </div>
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
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of investors and entrepreneurs who are already part of the MicroStartupX community.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">Join as Investor</Link>
              <Link to="/register" className="cta-btn secondary">List Your Startup</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 