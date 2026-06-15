const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  targetMarket: { type: String, required: true },
  revenueModel: { type: String, required: true },
  techStack: [{ type: String }],
  estimatedCost: { type: Number, required: true },
  timeline: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  imageUrl: { type: String },
  author: { type: String, default: 'Anonymous' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  status: { type: String, enum: ['Idea', 'In Development', 'Launched'], default: 'Idea' },
  tags: [{ type: String }],
  dateAdded: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Idea', ideaSchema); 