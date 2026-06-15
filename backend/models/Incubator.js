const mongoose = require('mongoose');

const incubatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: '' },
    focus: { type: [String], default: [] }, // mentorship, labs, networking, funding, workspace
    url: { type: String, default: '' },
    tags: { type: [String], default: [] },
    icon: { type: String, default: '' },
    dateAdded: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incubator', incubatorSchema);


