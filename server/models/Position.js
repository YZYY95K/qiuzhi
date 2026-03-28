const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  min: Number,
  max: Number
});

const positionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: salarySchema,
  requirements: [String],
  description: {
    type: String,
    required: true
  },
  skills: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Position', positionSchema);
