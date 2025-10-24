const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const VpnKey = require('../models/VpnKey');

const router = express.Router();

// Get dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const userStats = await User.getStats();
    const vpnStats = await VpnKey.getStats();

    res.json({
      success: true,
      data: {
        users: userStats,
        vpnKeys: vpnStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard stats'
    });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await User.getAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: {
        users: result.users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting users'
    });
  }
});

// Get all VPN keys
router.get('/vpn-keys', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await VpnKey.getAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: {
        keys: result.keys,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting VPN keys'
    });
  }
});

// Update user subscription
router.put('/users/:userId/subscription', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { active, expiresAt } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updateData = {};
    if (active !== undefined) updateData.subscription_active = active;
    if (expiresAt) updateData.subscription_expires_at = new Date(expiresAt);

    const updatedUser = await User.update(userId, updateData);

    res.json({
      success: true,
      message: 'User subscription updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          subscriptionActive: updatedUser.subscription_active,
          subscriptionExpiresAt: updatedUser.subscription_expires_at
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user subscription'
    });
  }
});

// Deactivate VPN key
router.put('/vpn-keys/:keyId/deactivate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { keyId } = req.params;

    const key = await VpnKey.findById(keyId);
    if (!key) {
      return res.status(404).json({
        success: false,
        message: 'VPN key not found'
      });
    }

    const updatedKey = await VpnKey.update(keyId, { active: false });

    res.json({
      success: true,
      message: 'VPN key deactivated successfully',
      data: {
        key: {
          id: updatedKey.id,
          active: updatedKey.active
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating VPN key'
    });
  }
});

module.exports = router;
