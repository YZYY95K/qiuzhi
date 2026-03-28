const express = require('express');
const Position = require('../models/Position');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { title, location, skills, page = 1, limit = 10 } = req.query;

    const query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (skills) query.skills = { $in: skills.split(',') };

    const positions = await Position.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Position.countDocuments(query);

    res.json({
      positions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/recommend', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { matchPositions } = require('../services/openai');

    const positions = await Position.find().limit(50);

    if (positions.length === 0) {
      return res.json({ recommendations: [], message: 'No positions available' });
    }

    const userProfile = {
      skills: user.resume?.skills || [],
      experience: user.resume?.experience || [],
      education: user.resume?.education || [],
      targetPositions: user.preferences?.targetPositions || [],
      targetCities: user.preferences?.targetCities || []
    };

    const matchedPositions = await matchPositions(userProfile, positions);

    const recommendations = matchedPositions
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)
      .map(match => {
        const position = positions.find(p => p._id.toString() === match.positionId);
        return {
          position,
          matchScore: match.matchScore,
          matchReasons: match.matchReasons,
          candidateStrengths: match.candidateStrengths,
          areasForImprovement: match.areasForImprovement
        };
      });

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const position = new Position(req.body);
    await position.save();
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
