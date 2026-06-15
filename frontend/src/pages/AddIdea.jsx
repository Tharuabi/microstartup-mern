import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/AddIdea.css';

const AddIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    problem: '',
    solution: '',
    targetMarket: '',
    revenueModel: '',
    techStack: '',
    estimatedCost: '',
    timeline: '',
    difficulty: 'Intermediate',
    author: '',
    tags: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  const categories = [
    'AI Tool', 'App', 'SaaS', 'eCommerce', 'EdTech', 'Web3', 
    'Healthcare', 'FinTech', 'IoT', 'Gaming', 'Social', 'Other'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📝' },
    { number: 2, title: 'Problem & Solution', icon: '🎯' },
    { number: 3, title: 'Business Model', icon: '💰' },
    { number: 4, title: 'Technical Details', icon: '⚙️' },
    { number: 5, title: 'Author & Tags', icon: '👤' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: null }));
    } else {
      setImage(null);
      setImagePreview(null);
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file.' }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required.';
        if (!formData.description.trim()) newErrors.description = 'Description is required.';
        if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters.';
        if (!formData.category) newErrors.category = 'Category is required.';
        break;
      case 2:
        if (!formData.problem.trim()) newErrors.problem = 'Problem statement is required.';
        if (!formData.solution.trim()) newErrors.solution = 'Solution is required.';
        break;
      case 3:
        if (!formData.targetMarket.trim()) newErrors.targetMarket = 'Target market is required.';
        if (!formData.revenueModel.trim()) newErrors.revenueModel = 'Revenue model is required.';
        break;
      case 4:
        if (!formData.techStack.trim()) newErrors.techStack = 'Tech stack is required.';
        if (!formData.estimatedCost || isNaN(formData.estimatedCost) || formData.estimatedCost <= 0) {
          newErrors.estimatedCost = 'Valid estimated cost required.';
        }
        if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required.';
        break;
      case 5:
        if (!formData.author.trim()) newErrors.author = 'Author name is required.';
        if (!formData.tags.trim()) newErrors.tags = 'Tags are required.';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setSubmissionSuccess(false);

    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmissionSuccess(true);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setFormData({
            title: '',
            description: '',
            category: '',
            problem: '',
            solution: '',
            targetMarket: '',
            revenueModel: '',
            techStack: '',
            estimatedCost: '',
            timeline: '',
            difficulty: 'Intermediate',
            author: '',
            tags: ''
          });
          setImage(null);
          setImagePreview(null);
          setSubmissionSuccess(false);
          setCurrentStep(1);
          navigate('/projectpage');
        }, 3000);
      } else {
        let errorMsg = 'Error submitting idea.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonErr) {
          // Not JSON, keep default
        }
        setErrors({ submit: errorMsg });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content ap-form">
            <div className="form-group ap-form-group--full">
              <label htmlFor="title">Idea Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., AI-Powered Personal Chef"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group ap-form-group--full">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your startup idea in detail..."
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              <div className="char-count">{formData.description.length}/500</div>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content ap-form">
            <div className="form-group ap-form-group--full">
              <label htmlFor="problem">Problem Statement *</label>
              <textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleInputChange}
                placeholder="What problem does your idea solve?"
                rows="3"
                className={errors.problem ? 'error' : ''}
              />
              {errors.problem && <span className="error-text">{errors.problem}</span>}
            </div>

            <div className="form-group ap-form-group--full">
              <label htmlFor="solution">Solution *</label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                placeholder="How does your idea solve this problem?"
                rows="3"
                className={errors.solution ? 'error' : ''}
              />
              {errors.solution && <span className="error-text">{errors.solution}</span>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content ap-form">
            <div className="form-group ap-form-group--full">
              <label htmlFor="targetMarket">Target Market *</label>
              <input
                type="text"
                id="targetMarket"
                name="targetMarket"
                value={formData.targetMarket}
                onChange={handleInputChange}
                placeholder="e.g., Busy professionals, health-conscious individuals"
                className={errors.targetMarket ? 'error' : ''}
              />
              {errors.targetMarket && <span className="error-text">{errors.targetMarket}</span>}
            </div>

            <div className="form-group ap-form-group--full">
              <label htmlFor="revenueModel">Revenue Model *</label>
              <input
                type="text"
                id="revenueModel"
                name="revenueModel"
                value={formData.revenueModel}
                onChange={handleInputChange}
                placeholder="e.g., Subscription ($9.99/month) + Premium features"
                className={errors.revenueModel ? 'error' : ''}
              />
              {errors.revenueModel && <span className="error-text">{errors.revenueModel}</span>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content ap-form">
            <div className="form-group ap-form-group--full">
              <label htmlFor="techStack">Tech Stack *</label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, MongoDB, AI/ML"
                className={errors.techStack ? 'error' : ''}
              />
              {errors.techStack && <span className="error-text">{errors.techStack}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="estimatedCost">Estimated Cost (₹) *</label>
              <input
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleInputChange}
                placeholder="25000"
                className={errors.estimatedCost ? 'error' : ''}
              />
              {errors.estimatedCost && <span className="error-text">{errors.estimatedCost}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="timeline">Timeline *</label>
              <input
                type="text"
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                placeholder="e.g., 6-8 months"
                className={errors.timeline ? 'error' : ''}
              />
              {errors.timeline && <span className="error-text">{errors.timeline}</span>}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content ap-form">
            <div className="form-group">
              <label htmlFor="author">Author Name *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Your name or pseudonym"
                className={errors.author ? 'error' : ''}
              />
              {errors.author && <span className="error-text">{errors.author}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags *</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., AI, Food, Health, Personalization (comma-separated)"
                className={errors.tags ? 'error' : ''}
              />
              {errors.tags && <span className="error-text">{errors.tags}</span>}
            </div>

            <div className="form-group ap-form-group--full">
              <label htmlFor="image">Idea Image (Optional)</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <div className="file-upload-label">
                  <span className="upload-icon">📁</span>
                  <span style={{color: 'var(--text-dim)'}}>Choose an image or drag it here</span>
                </div>
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-idea-container">
      <div className="add-idea-header">
        <div className="header-content">
          <h1>💡 Submit Your Startup Idea</h1>
          <p>Share your innovative startup idea with the community. Help others get inspired and get feedback on your concept!</p>
        </div>
      </div>

      <div className="add-idea-form-container" style={{background: 'transparent', boxShadow: 'none'}}>
        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`step ${currentStep >= step.number ? 'active' : ''}`}
            >
              <div className="step-icon">
                {currentStep > step.number ? '✅' : step.icon}
              </div>
              <div className="step-info">
                <span className="step-title">{step.title}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="add-idea-form" style={{padding: 0, display: 'block'}}>
          {submissionSuccess && (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h3>Idea Submitted Successfully!</h3>
              <p>Your startup idea has been added to our collection. Redirecting to projects page...</p>
            </div>
          )}

          {errors.submit && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <p>{errors.submit}</p>
            </div>
          )}

          {renderStepContent()}

          {/* Form Actions */}
          <div className="form-actions" style={{marginTop: 48}}>
            {currentStep > 1 ? (
              <button type="button" className="prev-btn" onClick={prevStep}>
                ← Previous Step
              </button>
            ) : (
              <button type="button" className="prev-btn" onClick={() => navigate('/add-project')}>
                ← Back to Projects
              </button>
            )}

            {currentStep < 5 ? (
              <button type="button" className="next-btn" onClick={nextStep}>
                Next Step →
              </button>
            ) : (
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : '🚀 Submit Startup Idea'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIdea; 