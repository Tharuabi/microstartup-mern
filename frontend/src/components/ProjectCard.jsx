import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/ProjectPage.css';

const ExternalLinkIcon = () => <span className="pp-icon pp-icon-external-link">🔗</span>;
const CartIcon = () => <span className="pp-icon pp-icon-cart">🛒</span>;
const VisitIcon = () => <span className="pp-icon pp-icon-visit">👁️</span>;

const ProjectCard = ({ project, onAddToCart, onTitleClick }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  if (!project) return null;

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (onAddToCart) {
      onAddToCart(project);
    }
    
    setShowAddedMessage(true);
    setIsAddingToCart(false);
    
    // Hide the message after 2 seconds
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);
  };

  return (
    <div className="pp-project-card">
      <Link to={`/project/${project._id || project.id}`} className="pp-card-image-link" aria-label={`View details for ${project.title}`}> 
        <div className="pp-card-image-container">
          <img src={project.imageUrl || project.image || 'https://via.placeholder.com/400x225/E2E8F0/4A5568?text=No+Image'} alt={project.title} className="pp-card-image"/>
          <span className="pp-card-category-badge-on-image">{project.category}</span>
        </div>
      </Link>
      <div className="pp-card-content">
        <h3 className="pp-card-title">
          <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => onTitleClick && onTitleClick(project)}>{project.title}</span>
        </h3>
        <p className="pp-card-description">{(project.shortDescription || project.description)?.substring(0, 90)}{(project.shortDescription || project.description)?.length > 90 ? '...' : ''}</p>
        
        {/* Visit Button - Always show if external link exists */}
        {project.externalLink && (
          <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="pp-project-link pp-visit-link">
            <VisitIcon /> Visit Project
          </a>
        )}
        
        <div className="pp-card-tech-stack">
          {project.techStack?.slice(0, 3).map((tech, index) => (
            <span key={index} className="pp-tech-badge">{tech}</span>
          ))}
          {project.techStack?.length > 3 && <span className="pp-tech-badge">+{project.techStack.length - 3} more</span>}
        </div>
      </div>
      <div className="pp-card-footer">
        <span className="pp-card-price">₹{project.price?.toLocaleString('en-IN')}</span>
        
        {/* Add to Cart Button with Loading State */}
        <button 
          onClick={handleAddToCart} 
          className={`pp-btn pp-btn-add-to-cart ${isAddingToCart ? 'loading' : ''} ${showAddedMessage ? 'added' : ''}`}
          disabled={isAddingToCart}
          aria-label={`Add ${project.title} to cart`}
        >
          {isAddingToCart ? (
            <span className="loading-spinner">⏳</span>
          ) : showAddedMessage ? (
            <span className="added-text">✅ Added!</span>
          ) : (
            <>
              <CartIcon /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard; 