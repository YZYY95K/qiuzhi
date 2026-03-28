const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  duration: String,
  description: String
});

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  major: String,
  graduationYear: Number
});

const salaryRangeSchema = new mongoose.Schema({
  min: Number,
  max: Number
});

const resumeSchema = new mongoose.Schema({
  fileUrl: String,
  parsedContent: String,
  skills: [String],
  experience: [experienceSchema],
  education: [educationSchema]
});

const preferencesSchema = new mongoose.Schema({
  targetPositions: [String],
  targetCities: [String],
  salaryRange: salaryRangeSchema
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: String,
  resume: resumeSchema,
  preferences: preferencesSchema
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
