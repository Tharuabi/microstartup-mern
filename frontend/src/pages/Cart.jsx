import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../style/Cart.css';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Navigate to payment page with cart items
    const total = getCartTotal();
    const params = new URLSearchParams({
      cartItems: JSON.stringify(items),
      total: total.toString(),
      fromCart: 'true'
    });
    navigate(`/payment?${params.toString()}`);
  };

  // Test function to store payment in database
  const testPaymentStorage = async () => {
    try {
      const response = await fetch('/api/test-payment-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: 'test@example.com',
          customerName: 'Test User',
          totalAmount: 5000,
          fromCart: false,
          items: [{ title: 'Test Project', price: 5000, quantity: 1 }]
        })
      });
      
      const result = await response.json();
      alert(result.message || 'Test payment stored!');
    } catch (error) {
      console.error('Error testing payment storage:', error);
      alert('Error testing payment storage');
    }
  };

  // Clear cart after successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    if (paymentSuccess === 'true') {
      clearCart();
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Redirect to home page after successful payment
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    }
  }, [clearCart, navigate]);

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <h2 style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</h2>
            <h2>Your Cart is Empty</h2>
            <p>Ready to launch your next big thing? Browse our curated startups.</p>
            <button 
              className="cart-browse-btn"
              onClick={() => navigate('/projectpage')}
            >
              Browse Startups
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping <span style={{ color: 'var(--accent)' }}>Cart</span></h1>
          <button 
            className="cart-clear-btn"
            onClick={clearCart}
          >
            Clear All
          </button>
        </div>

        <div className="cart-main-layout">
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item._id} className="cart-horizontal-card">
                <div className="cart-item-img">
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/100x100?text=Startup'} 
                    alt={item.title} 
                  />
                </div>
                
                <div className="cart-item-info">
                  <div className="cart-item-main">
                    <div className="cart-item-top">
                      <span className="cart-item-tag">{item.category}</span>
                      <h3>{item.title}</h3>
                    </div>
                    <p>{item.shortDescription?.substring(0, 100)}...</p>
                  </div>

                  <div className="cart-item-controls">
                    <div className="cart-quantity-group">
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-num">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="cart-item-price-group">
                      <span className="cart-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      <button 
                        className="cart-remove-icon"
                        onClick={() => handleRemoveItem(item._id)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar-summary">
            <div className="cart-summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Items ({items.length})</span>
                <span className="summary-value">₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              
              <div className="summary-row">
                <span>Platform Fee</span>
                <span className="summary-value free">FREE</span>
              </div>
              
              <div className="summary-total">
                <span>Total Amount</span>
                <span className="total-value">₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>

              <button 
                className="cart-checkout-btn-large"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                🚀 Proceed to Checkout
              </button>

              <button 
                className="cart-continue-link"
                onClick={() => navigate('/projectpage')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 