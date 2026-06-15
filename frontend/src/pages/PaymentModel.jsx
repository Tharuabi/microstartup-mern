// src/components/PaymentModal.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/PaymentModel.css'; // We'll create this CSS file

const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'; // Replace with your actual Key ID

const PaymentModal = ({
  isOpen,
  onClose,
  orderId,
  amount, // in paisa (e.g., 5500000 for ₹55,000.00)
  currency = 'INR',
  itemName = 'MicroStartupX Project',
  userName = 'Customer',
  userEmail = 'customer@example.com',
  userContact = '9999999999',
  onPaymentSuccess,
  onPaymentError,
}) => {
  const paymentForm = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const initializePayment = async () => {
      if (!isOpen || !orderId || !window.Razorpay) return;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: currency,
        name: 'MicroStartupX',
        description: `Payment for ${itemName}`,
        image: 'https://example.com/your_logo.png', // Optional: Your logo URL
        order_id: orderId, //This is a sample Order ID. Pass the `id` obtained from Orders API.
        handler: function (response) {
          // This function is called when payment is successful
          console.log('Payment successful:', response);
          // You should VERIFY THE SIGNATURE on your backend here
          // For now, we'll call the success callback
          onPaymentSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          onClose();
           window.location.href = 'http://localhost:5713/';
 // Close this modal
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userContact,
        },
        notes: {
          address: 'MicroStartupX Purchase',
        },
        theme: {
          color: '#3399cc', // Theme color for Razorpay modal
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed');
            onPaymentError({ code: 'MODAL_DISMISSED', description: 'Payment modal was dismissed by user.' });
            onClose(); // Close this modal
          },
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Payment failed:', response);
          onPaymentError({
            code: response.error.code,
            description: response.error.description,
            source: response.error.source,
            step: response.error.step,
            reason: response.error.reason,
            metadata: {
              order_id: response.error.metadata.order_id,
              payment_id: response.error.metadata.payment_id,
            },
          });
          onClose(); // Close this modal
        });
        rzp.open();
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
        onPaymentError({ code: 'INIT_ERROR', description: 'Failed to initialize Razorpay.' });
        onClose();
      }
    };

    if (isOpen) {
      loadRazorpayScript().then((loaded) => {
        if (loaded) {
          initializePayment();
        } else {
          console.error('Failed to load Razorpay SDK');
          onPaymentError({ code: 'SDK_LOAD_ERROR', description: 'Failed to load Razorpay SDK.' });
          onClose();
        }
      });
    }

   
    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
   
    };
  }, [isOpen, orderId, amount, currency, itemName, userName, userEmail, userContact, onPaymentSuccess, onPaymentError, onClose]);


 
  return null;
};

export default PaymentModal;