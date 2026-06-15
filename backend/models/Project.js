const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String, required: true },
  techStack: [{ type: String }],
  price: { type: Number, required: true },
  imageUrl: { type: String }, // Store path to uploaded image
  githubUrl: { type: String },
  demoUrl: { type: String },
  externalLink: { type: String }, // External demo or live link
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  dateAdded: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
