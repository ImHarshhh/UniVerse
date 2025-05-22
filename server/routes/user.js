import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/Users.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/me', protect, async (req, res) => {
  try {
    const { anonPostLimit } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { anonPostLimit },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Error updating anonPostLimit:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
