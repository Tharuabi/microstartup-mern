import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import '../style/PaymentPage.css';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get payment details from URL params
  const projectId = searchParams.get('projectId');
  const title = searchParams.get('title');
  const price = searchParams.get('price');
  const image = searchParams.get('image');
  const cartItems = searchParams.get('cartItems');
  const total = searchParams.get('total');
  const fromCart = searchParams.get('fromCart') === 'true';

  // Parse cart items if coming from cart
  const parsedCartItems = fromCart && cartItems ? JSON.parse(cartItems) : [];

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Customer details are optional since Stripe will collect them
    // But we can still validate if user enters them
    if (formData.customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Create Stripe checkout session
      const paymentData = fromCart 
        ? {
            title: `Cart Purchase (${parsedCartItems.length} items)`,
            amount: parseInt(total),
            items: parsedCartItems.map(item => ({
              title: item.title,
              price: item.price,
              quantity: item.quantity
            })),
            customerDetails: formData,
            fromCart: true
          }
        : {
            title: title,
            amount: parseInt(price),
            items: [{ title: title, price: parseInt(price) }],
            customerDetails: formData,
            fromCart: false
          };

      const response = await api.post('/api/create-checkout-session', paymentData);

      if (response.data.url) {
        // Store fromCart info in sessionStorage for success page
        if (fromCart) {
          sessionStorage.setItem('fromCart', 'true');
        }
        // Redirect to Stripe's hosted checkout page
        window.location.href = response.data.url;
      } else {
        setError('Failed to create checkout session. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!fromCart && (!projectId || !title || !price)) {
    return (
      <div className="payment-page">
        <div className="payment-error">
          <h2>Invalid Payment Request</h2>
          <p>Project details are missing. Please try again from the project page.</p>
          <button onClick={() => navigate('/projectpage')}>Back to Projects</button>
        </div>
      </div>
    );
  }

  if (fromCart && (!cartItems || !total || parsedCartItems.length === 0)) {
    return (
      <div className="payment-page">
        <div className="payment-error">
          <h2>Invalid Cart Payment Request</h2>
          <p>Cart details are missing. Please try again from the cart page.</p>
          <button onClick={() => navigate('/cart')}>Back to Cart</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Purchase</h1>
          <p>Secure payment powered by Stripe</p>
        </div>

        <div className="payment-content">
          {/* Order Summary */}
          {fromCart ? (
            <div className="cart-summary-section">
              <h3>🛒 Cart Summary</h3>
              <div className="cart-items-list">
                {parsedCartItems.map((item, index) => (
                  <div key={index} className="cart-item-summary">
                    <div className="cart-item-image">
                      <img 
                        src={item.imageUrl || 'https://via.placeholder.com/60x60?text=Project'} 
                        alt={item.title} 
                      />
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.title}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <span className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="project-summary">
              <div className="project-image">
                <img src={image || 'https://via.placeholder.com/300x200?text=Project'} alt={title} />
              </div>
              <div className="project-details">
                <h3>{title}</h3>
                <div className="price">₹{parseInt(price).toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Customer Details Form */}
          <div className="customer-details-section">
            <h3>Customer Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customerName">Full Name (Optional)</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name (optional)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerEmail">Email Address (Optional)</label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email address (optional)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerPhone">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number (optional)"
                />
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="payment-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{fromCart ? parseInt(total).toLocaleString('en-IN') : parseInt(price).toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Processing Fee:</span>
              <span>₹0</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{fromCart ? parseInt(total).toLocaleString('en-IN') : parseInt(price).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Stripe Checkout Section */}
          <div className="stripe-checkout-section">
            <div className="stripe-logo">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M59.64 14.28h-8.06v-1.83h8.06v1.83zm-8.06 5.99h8.06v-1.83h-8.06v1.83zm0-11.82v1.83h8.06V8.45h-8.06zm-2.81-2.81h-2.81v11.82h2.81V5.66zm-5.62 0h-2.81v11.82h2.81V5.66zm-5.62 0h-2.81v11.82h2.81V5.66zm-5.62 0H28.5v11.82h2.81V5.66zm-5.62 0h-2.81v11.82h2.81V5.66zm-5.62 0h-2.81v11.82h2.81V5.66zm-5.62 0h-2.81v11.82h2.81V5.66zm-5.62 0h-2.81v11.82h2.81V5.66zm-5.62 0h-2.81v11.82h2.81V5.66z" fill="#6772E5"/>
              </svg>
            </div>
            
            <button 
              onClick={handlePayment}
              className="stripe-checkout-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">⏳ Redirecting to Stripe...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V5zm0 8h2v2h-2v-2z" fill="currentColor"/>
                  </svg>
                  Pay with Stripe
                </>
              )}
            </button>
            
            <div className="stripe-info">
              <p>🔒 Secure payment powered by Stripe</p>
              <p>You'll be redirected to Stripe's secure checkout page</p>
              <div className="security-badges">
                <span className="security-badge">SSL Encrypted</span>
                <span className="security-badge">PCI Compliant</span>
                <span className="security-badge">256-bit Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 