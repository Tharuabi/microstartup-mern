const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  stripeCheckoutSessionId: {
    type: String,
    required: true,
    unique: true
  },
  stripePaymentIntentId: {
    type: String,
    required: false
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: false
  },
  customerAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postal_code: String,
    country: {
      type: String,
      default: 'IN'
    }
  },
  items: [{
    projectId: String,
    title: String,
    price: Number,
    imageUrl: String,
    quantity: {
      type: Number,
      default: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'inr'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'stripe'
  },
  fromCart: {
    type: Boolean,
    default: false
  },
  projectTitle: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema); 