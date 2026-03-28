const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  evaluation: String,
  score: Number
});

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  },
  questions: [questionSchema],
  overallEvaluation: String,
  totalScore: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
