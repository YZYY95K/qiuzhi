const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  completeness: Number,
  matchScore: Number,
  strengths: [String],
  weaknesses: [String],
  suggestions: [String]
});

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeContent: String,
  targetPosition: String,
  analysis: analysisSchema
}, {
  timestamps: true
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
