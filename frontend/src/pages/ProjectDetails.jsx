import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FundingSchemes from '../components/FundingSchemes';
import '../style/ProjectDetails.css';
import axios from 'axios';
// Local images used for graceful fallback when viewing demo/dummy projects
import featuredImage1 from '../assets/home5.jpg';
import featuredImage2 from '../assets/image2.jpg.jpg';
import featuredImage3 from '../assets/image3.jpg';

// Placeholder Icons
const CategoryIcon = () => <span className="pd-icon">🏷️</span>;
const TechIcon = () => <span className="pd-icon">💻</span>;
const LinkIcon = () => <span className="pd-icon">🔗</span>;
const UserIcon = () => <span className="pd-icon">👤</span>;
const StarIcon = () => <span className="pd-icon-rating">★</span>;
const PriceIcon = () => <span className="pd-icon">💲</span>;
const StageIcon = () => <span className="pd-icon">🚀</span>;
const IntentIcon = () => <span className="pd-icon">🎯</span>;
const DeliverablesIcon = () => <span className="pd-icon">📦</span>;
const ShareIcon = () => <span className="pd-icon">↪️</span>;
const BookmarkIcon = () => <span className="pd-icon">🔖</span>;
const ReportIcon = () => <span className="pd-icon">🚩</span>;
const CartIcon = () => <span className="pd-icon">🛒</span>; // New Cart Icon
const CloseIcon = () => <span className="pd-icon">❌</span>; // New Close Icon
const TrashIcon = () => <span className="pd-icon">🗑️</span>; // New Trash Icon

// Fetch real project by id

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/projects/${id}`);
        setProject(res.data);
        // Track a view (non-blocking)
        axios.put(`/api/projects/${id}/view`).catch(() => {});
      } catch (err) {
        // If API fails (e.g., demo IDs like 1, 2, 3 or ex1, ex2), fall back to local dummy data
        const fallbackById = {
          '1': {
            _id: '1',
            title: 'Recipe Finder App',
            category: 'App',
            price: 350,
            rating: 4.8,
            likes: 215,
            techStack: ['React', 'Node.js', 'MongoDB', 'API'],
            description:
              'Discover recipes and meal ideas with ratings and favorites. Explore culinary delights from around the globe.',
            longDescription:
              'This starter includes a full React front-end, Node.js API layer, user auth shell, and a MongoDB persistence model with seed data. Optimized for rapid customization and launch.',
            imageUrl: featuredImage1,
            stageOfDevelopment: 'MVP',
            lookingFor: 'Investment / Buyer',
          },
          '2': {
            _id: '2',
            title: 'Productivity MVP',
            category: 'MVP',
            price: 150,
            rating: 4.5,
            likes: 120,
            techStack: ['Vue.js', 'Firebase'],
            description:
              'Minimalistic task management app with reminders and deadlines for teams.',
            longDescription:
              'Includes authentication, cloud sync, and offline-first UX. Built for speed and ease of extension.',
            imageUrl: featuredImage2,
            stageOfDevelopment: 'Prototype',
            lookingFor: 'Early Adopters',
          },
          '3': {
            _id: '3',
            title: 'ClipShare Social',
            category: 'App',
            price: 500,
            rating: 4.2,
            likes: 350,
            techStack: ['Next.js', 'Express', 'PostgreSQL'],
            description:
              'Social platform for sharing short video clips with a vibrant community.',
            longDescription:
              'Production-grade Next.js app with feed, comments, likes, and queue-based processing demo.',
            imageUrl: featuredImage3,
            stageOfDevelopment: 'Beta',
            lookingFor: 'Investors',
          },
          // Explore grid demo IDs
          ex1: {
            _id: 'ex1',
            title: 'Modern E-commerce Store',
            category: 'eCommerce',
            price: 1250,
            techStack: ['Shopify', 'Liquid', 'JS'],
            description:
              'A fully functional store template for modern brands. Customizable and scalable.',
            longDescription:
              'Includes collections, product pages, cart/checkout workflows, and performance best practices.',
            imageUrl:
              'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=70',
            stageOfDevelopment: 'Launched',
            lookingFor: 'Buyer',
          },
          ex2: {
            _id: 'ex2',
            title: 'SaaS Dashboard Kit',
            category: 'SaaS',
            price: 800,
            techStack: ['Node.js', 'React', 'Stripe'],
            description:
              'Starter kit for subscription products with auth and billing ready to go.',
            longDescription:
              'Stripe-powered billing, RBAC auth shell, and modular UI system for rapid feature work.',
            imageUrl:
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=70',
            stageOfDevelopment: 'MVP',
            lookingFor: 'Buyer',
          },
          ex3: {
            _id: 'ex3',
            title: 'Travel Blog Theme',
            category: 'Website',
            price: 220,
            techStack: ['WordPress', 'PHP', 'CSS'],
            description:
              'Beautiful responsive theme for travel bloggers. SEO optimized.',
            longDescription:
              'Includes custom post types, SEO meta, and flexible layouts. Ready for deployment.',
            imageUrl:
              'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=70',
            stageOfDevelopment: 'Stable',
            lookingFor: 'Buyer',
          },
        };

        const fallbackProject = fallbackById[String(id)];
        if (fallbackProject) {
          setProject(fallbackProject);
          setError(null);
        } else {
          setError('Failed to load project');
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  // If opened without an id (from navbar Funding Schemes), render schemes page
  if (!id) {
    return (
      <div className="project-details-page-container" style={{ padding: '24px' }}>
        <div className="pd-title-header" style={{ marginBottom: 16 }}>
          <h1 className="pd-project-title">Startup Funding Schemes</h1>
        </div>
        <FundingSchemes />
      </div>
    );
  }

  // Load related projects by category
  useEffect(() => {
    const fetchRelated = async () => {
      if (!project?.category) return;
      try {
        const res = await axios.get('/api/projects');
        const all = res.data || [];
        const related = all
          .filter(p => p._id !== project._id && p.category && p.category.toLowerCase() === project.category.toLowerCase())
          .slice(0, 8);
        setRelatedProjects(related);
      } catch (_) {
        setRelatedProjects([]);
      }
    };
    fetchRelated();
  }, [project]);

  const handleContactSeller = () => alert(`Contacting seller of "${project?.title || ''}".`);
  const handleBookmarkProject = () => alert(`Project "${project.title}" bookmarked!`);
  const handleSocialShare = (platform) => {
    let shareUrl = encodeURIComponent(window.location.href);
    let text = encodeURIComponent(`Check out: ${project.title}`);
    let url = platform === 'Twitter' ? `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`
            : platform === 'Facebook' ? `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
            : platform === 'LinkedIn' ? `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${text}` : '';
    if (url) window.open(url, '_blank', 'noopener,noreferrer'); else alert(`Sharing on ${platform}.`);
  };
  const handleReportListing = () => alert(`Reporting listing "${project.title}".`);

  // --- CART FUNCTIONALITY ---
  const handleAddToCart = (projectToAdd) => {
    if (!projectToAdd) return;
    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(item => item._id === projectToAdd._id);
      if (isItemInCart) {
        alert(`${projectToAdd.title} is already in your cart.`);
        return prevItems;
      }
      alert(`${projectToAdd.title} added to cart!`);
      return [...prevItems, projectToAdd];
    });
  };

  const handleRemoveFromCart = (projectIdToRemove) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== projectIdToRemove));
  };

  const toggleCartVisibility = () => setIsCartVisible(!isCartVisible);

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  // Direct payment for individual project
  const handleDirectPayment = async (project) => {
    if (!project.price || project.price <= 0) {
      alert('Invalid project price.');
      return;
    }

    const params = new URLSearchParams({
      projectId: project._id,
      title: project.title,
      price: String(project.price),
      image: project.imageUrl || ''
    });
    navigate(`/payment?${params.toString()}`);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const params = new URLSearchParams({
      fromCart: 'true',
      cartItems: JSON.stringify(cartItems.map(ci => ({
        title: ci.title,
        price: ci.price,
        quantity: 1,
        imageUrl: ci.imageUrl || ''
      }))),
      total: String(calculateCartTotal())
    });
    navigate(`/payment?${params.toString()}`);
  };

  if (loading) return <div className="pd-loading">Loading Project Details...</div>;
  if (error) return <div className="pd-loading">{error}</div>;
  if (!project) return null;

  return (
    <>
      {/* --- DEMO NAVIGATION & CART ICON --- */}
      <div className="pd-demo-nav">
        <button onClick={() => navigate(-1)}>« Back</button>
        <span>{project.title}</span>
        <button onClick={toggleCartVisibility} className="pd-cart-toggle-button">
          <CartIcon /> Cart ({cartItems.length})
        </button>
      </div>

      {/* --- CART MODAL --- */}
      {isCartVisible && (
        <div className="pd-cart-modal-overlay">
          <div className="pd-cart-modal">
            <div className="pd-cart-modal-header">
              <h2>Your Cart</h2>
              <button onClick={toggleCartVisibility} className="pd-cart-close-button"><CloseIcon /></button>
            </div>
            <div className="pd-cart-modal-body">
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <ul className="pd-cart-items-list">
                  {cartItems.map(item => (
                    <li key={item.id} className="pd-cart-item">
                      <img src={item.image || 'https://via.placeholder.com/50x50/E2E8F0/4A5568?text=Img'} alt={item.title} className="pd-cart-item-image" />
                      <div className="pd-cart-item-details">
                        <span className="pd-cart-item-title">{item.title}</span>
                        <span className="pd-cart-item-price">
                          {item.price > 0 ? `$${item.price.toLocaleString()}` : (item.lookingFor && item.lookingFor.toLowerCase().includes('investment')) ? `Seeking: ${item.lookingFor}` : 'Contact for Price'}
                        </span>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="pd-cart-item-remove-button">
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="pd-cart-modal-footer">
                <div className="pd-cart-total">
                  Total: <span>${calculateCartTotal().toLocaleString()}</span>
                </div>
                <button onClick={handleCheckout} className="pd-cart-checkout-button">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="project-details-page-container"> {/* Outer container for page context */}
        <div className="project-details-layout-container"> {/* Flex container for main and sidebar */}
          {/* --- Main Content Area (Left) --- */}
          <main className="pd-main-content-area">
            <section className="pd-image-section">
              <img
                src={project.imageUrl || 'https://via.placeholder.com/1000x600/E2E8F0/4A5568?text=Project+Image'}
                alt={`${project.title} main visual`}
                className="pd-main-image"
              />
            </section>

            <div className="pd-title-header">
              <h1 className="pd-project-title">{project.title}</h1>
              <button onClick={handleBookmarkProject} className="pd-bookmark-button">
                <BookmarkIcon /> Save
              </button>
            </div>

            <div className="pd-meta-info-badges">
              <span className="pd-meta-badge"><CategoryIcon /> {project.category}</span>
              <span className="pd-meta-badge"><StageIcon /> {project.stageOfDevelopment}</span>
              <span className="pd-meta-badge"><IntentIcon /> {project.lookingFor}</span>
            </div>

            <section className="pd-description-section">
              <p>{project.longDescription || project.description}</p>
            </section>

            {project.deliverables && project.deliverables.length > 0 && (
              <section className="pd-deliverables-section">
                <h2 className="pd-section-heading"><DeliverablesIcon /> What You Get</h2>
                <ul className="pd-deliverables-list">
                  {project.deliverables.map((item, index) => (
                    <li key={index} className="pd-deliverable-item">{item}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="pd-tech-stack-section">
              <h2 className="pd-section-heading"><TechIcon /> Tech Stack</h2>
              <div className="pd-tech-tags-container">
                {project.techStack && project.techStack.length > 0 && project.techStack[0] !== 'N/A' ? (
                  project.techStack.map((tech, index) => (
                    <span key={index} className="pd-tech-tag">{tech}</span>
                  ))
                ) : (
                  <p className="pd-no-info-text">Not specified.</p>
                )}
              </div>
            </section>

            <section className="pd-project-links-section">
              <h2 className="pd-section-heading"><LinkIcon /> Project Links</h2>
              <div className="pd-link-buttons-wrapper">
                {(project.githubUrl && project.githubUrl !== '#') || (project.externalLink && project.externalLink !== '#') || (project.demoUrl && project.demoUrl !== '#') ? (
                  <>
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="pd-action-link-button">View GitHub Repo</a>
                    )}
                    {project.externalLink && project.externalLink !== '#' && (
                      <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="pd-action-link-button">View Live Demo</a>
                    )}
                    {!project.externalLink && project.demoUrl && project.demoUrl !== '#' && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="pd-action-link-button">View Live Demo</a>
                    )}
                  </>
                ) : (
                  <p className="pd-no-info-text">No public links provided.</p>
                )}
              </div>
            </section>

            <section className="pd-share-project-section">
              <h2 className="pd-section-heading"><ShareIcon /> Share this Project</h2>
              <div className="pd-social-share-buttons">
                <button onClick={() => handleSocialShare('Twitter')} className="pd-social-button">Twitter</button>
                <button onClick={() => handleSocialShare('Facebook')} className="pd-social-button">Facebook</button>
                <button onClick={() => handleSocialShare('LinkedIn')} className="pd-social-button">LinkedIn</button>
              </div>
            </section>
          </main>

          {/* --- Sidebar Area (Right) --- */}
          <aside className="pd-sidebar-area">
            <section className="pd-sidebar-widget pd-interest-widget">
              <h3 className="pd-widget-title">Startup Funding Schemes</h3>
              <div className="mt-3">
                <FundingSchemes />
                </div>
            </section>
          </aside>
        </div>

        {/* Funding schemes section shown in sidebar above; remove related grid per request */}

        <footer className="pd-page-footer">
          <p>© {new Date().getFullYear()} MicroStartupX. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default ProjectDetails;