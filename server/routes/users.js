const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          telegramId: user.telegram_id,
          role: user.role,
          subscriptionActive: user.subscription_active,
          subscriptionExpiresAt: user.subscription_expires_at,
          referralCode: user.referral_code,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    const updateData = {};
    if (email) updateData.email = email;

    const user = await User.update(userId, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          telegramId: user.telegram_id,
          role: user.role,
          subscriptionActive: user.subscription_active,
          subscriptionExpiresAt: user.subscription_expires_at,
          referralCode: user.referral_code
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// Get referral stats
router.get('/referrals', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Get referred users count
    const referredUsers = await User.getReferredUsers(userId);
    
    res.json({
      success: true,
      data: {
        referralCode: user.referral_code,
        referredUsers: referredUsers.length,
        referralEarnings: user.referral_earnings || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error getting referral stats'
    });
  }
});

module.exports = router;
