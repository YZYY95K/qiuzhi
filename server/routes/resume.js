const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  }
});

router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.resume.fileUrl = req.file.path;
    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      fileUrl: req.file.path
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { parsedContent, skills, experience, education } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.resume.parsedContent = parsedContent;
    user.resume.skills = skills;
    user.resume.experience = experience;
    user.resume.education = education;

    await user.save();

    res.json({
      message: 'Resume updated successfully',
      resume: user.resume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.resume = undefined;
    await user.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
