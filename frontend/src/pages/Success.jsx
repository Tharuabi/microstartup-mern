// src/pages/Success.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import api from '../api';
import '../style/Success.css';

const Success = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const stateData = location.state;

    if (stateData) {
      // Data from custom payment page
      setPaymentData({
        amount: stateData.amount,
        orderDetails: stateData.orderDetails,
        customerDetails: stateData.customerDetails,
        paymentMethod: 'Credit Card',
        transactionId: 'TXN_' + Date.now()
      });
      setLoading(false);
    } else if (sessionId) {
      // Data from Stripe checkout
      fetchPaymentDetails(sessionId);
    } else {
      setError('No payment information found');
      setLoading(false);
    }
  }, [searchParams, location.state]);

  // Check if this was a cart payment and show success message first
  useEffect(() => {
    if (paymentData) {
      const fromCart = location.state?.fromCart || sessionStorage.getItem('fromCart');
      if (fromCart) {
        // Clear the sessionStorage
        sessionStorage.removeItem('fromCart');
        // Show success message for 3 seconds then redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
      }
    }
  }, [paymentData, location.state]);

  const fetchPaymentDetails = async (sessionId) => {
    try {
      const response = await api.get(`/api/checkout-success?session_id=${sessionId}`);
      if (response.data.success) {
        setPaymentData({
          amount: response.data.amount,
          paymentMethod: 'Stripe Checkout',
          transactionId: sessionId,
          customerDetails: {
            name: response.data.customerName,
            email: response.data.customerEmail
          }
        });
      } else {
        setError(response.data.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Error fetching payment details:', err);
      setError(err.response?.data?.message || 'Unable to verify payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="loading-spinner">⏳</div>
          <h1>Processing Payment...</h1>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="error-icon">❌</div>
          <h1>Payment Error</h1>
          <p>{error}</p>
          <div className="action-buttons">
            <Link to="/projectpage" className="primary-button">
              Try Again
            </Link>
            <Link to="/dashboard" className="secondary-button">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully. You will receive a confirmation email shortly.</p>

        {paymentData && (
          <div className="payment-details">
            <h3>Payment Details</h3>
            <p><strong>Amount:</strong> ₹{paymentData.amount?.toLocaleString()}</p>
            <p><strong>Payment Method:</strong> {paymentData.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
            {paymentData.customerDetails && (
              <>
                <p><strong>Customer:</strong> {paymentData.customerDetails.name}</p>
                <p><strong>Email:</strong> {paymentData.customerDetails.email}</p>
              </>
            )}
          </div>
        )}

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>You will receive a confirmation email with your purchase details</li>
            <li>Your order will be processed within 24 hours</li>
            <li>You can track your order status in your dashboard</li>
            <li>For any questions, please contact our support team</li>
          </ul>
        </div>

        <div className="action-buttons">
          <Link to="/dashboard" className="primary-button">
            Go to Dashboard
          </Link>
          <Link to="/home" className="secondary-button">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
