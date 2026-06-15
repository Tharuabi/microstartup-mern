const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, default: 'Grant' }, // Grant | Competition | Funding | Mentoring | Announcement
    amount: { type: String, default: '' },
    audience: { type: String, default: '' },
    eligibility: { type: String, default: '' },
    agency: { type: String, default: '' },
    url: { type: String, default: '' },
    tags: { type: [String], default: [] },
    deadline: { type: Date },
    dateAdded: { type: Date, default: Date.now },
    icon: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    source: { type: String, default: 'manual' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', schemeSchema);


