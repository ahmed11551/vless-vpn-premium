const { v4: uuidv4 } = require('uuid');
const VpnKey = require('../models/VpnKey');
const User = require('../models/User');
const logger = require('../utils/logger');

class VpnController {
  // Generate new VPN key
  static async generateKey(req, res) {
    try {
      const userId = req.user.id;
      const { serverLocation, plan } = req.body;

      // Check if user has active subscription
      const user = await User.findById(userId);
      if (!user.subscription_active) {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required to generate VPN keys'
        });
      }

      // Generate VLESS key
      const keyId = uuidv4();
      const key = `${process.env.VLESS_UUID_PREFIX || 'vless-premium'}-${keyId}`;

      const keyData = {
        user_id: userId,
        key: key,
        server_location: serverLocation || 'Netherlands',
        plan: plan || 'premium',
        active: true,
        expires_at: user.subscription_expires_at,
        created_at: new Date()
      };

      const vpnKey = await VpnKey.create(keyData);

      logger.info(`New VPN key generated for user ${userId}: ${key}`);

      res.status(201).json({
        success: true,
        message: 'VPN key generated successfully',
        data: {
          key: vpnKey.key,
          serverLocation: vpnKey.server_location,
          plan: vpnKey.plan,
          expiresAt: vpnKey.expires_at,
          createdAt: vpnKey.created_at
        }
      });
    } catch (error) {
      logger.error('Generate key error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error generating VPN key'
      });
    }
  }

  // Get user's VPN keys
  static async getUserKeys(req, res) {
    try {
      const userId = req.user.id;
      const keys = await VpnKey.findByUserId(userId);

      res.json({
        success: true,
        data: {
          keys: keys.map(key => ({
            id: key.id,
            key: key.key,
            serverLocation: key.server_location,
            plan: key.plan,
            active: key.active,
            expiresAt: key.expires_at,
            createdAt: key.created_at,
            lastUsed: key.last_used
          }))
        }
      });
    } catch (error) {
      logger.error('Get user keys error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error getting VPN keys'
      });
    }
  }

  // Get VPN key details
  static async getKeyDetails(req, res) {
    try {
      const { keyId } = req.params;
      const userId = req.user.id;

      const key = await VpnKey.findById(keyId);
      if (!key || key.user_id !== userId) {
        return res.status(404).json({
          success: false,
          message: 'VPN key not found'
        });
      }

      // Get usage statistics for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const usageStats = await VpnKey.getUsageStats(keyId, thirtyDaysAgo, new Date());

      res.json({
        success: true,
        data: {
          key: {
            id: key.id,
            key: key.key,
            serverLocation: key.server_location,
            plan: key.plan,
            active: key.active,
            expiresAt: key.expires_at,
            createdAt: key.created_at,
            lastUsed: key.last_used
          },
          usageStats
        }
      });
    } catch (error) {
      logger.error('Get key details error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error getting key details'
      });
    }
  }

  // Deactivate VPN key
  static async deactivateKey(req, res) {
    try {
      const { keyId } = req.params;
      const userId = req.user.id;

      const key = await VpnKey.findById(keyId);
      if (!key || key.user_id !== userId) {
        return res.status(404).json({
          success: false,
          message: 'VPN key not found'
        });
      }

      const updatedKey = await VpnKey.update(keyId, { active: false });

      logger.info(`VPN key deactivated: ${keyId} by user ${userId}`);

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
      logger.error('Deactivate key error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error deactivating VPN key'
      });
    }
  }

  // Get available server locations
  static async getServerLocations(req, res) {
    try {
      const locations = [
        {
          id: 'netherlands',
          name: 'Netherlands',
          flag: '🇳🇱',
          city: 'Amsterdam',
          latency: '15ms',
          status: 'online'
        },
        {
          id: 'germany',
          name: 'Germany',
          flag: '🇩🇪',
          city: 'Frankfurt',
          latency: '25ms',
          status: 'online'
        },
        {
          id: 'france',
          name: 'France',
          flag: '🇫🇷',
          city: 'Paris',
          latency: '30ms',
          status: 'online'
        },
        {
          id: 'usa',
          name: 'United States',
          flag: '🇺🇸',
          city: 'New York',
          latency: '120ms',
          status: 'online'
        },
        {
          id: 'russia',
          name: 'Russia',
          flag: '🇷🇺',
          city: 'Moscow',
          latency: '45ms',
          status: 'online'
        },
        {
          id: 'kazakhstan',
          name: 'Kazakhstan',
          flag: '🇰🇿',
          city: 'Almaty',
          latency: '60ms',
          status: 'online'
        }
      ];

      res.json({
        success: true,
        data: { locations }
      });
    } catch (error) {
      logger.error('Get server locations error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error getting locations'
      });
    }
  }

  // Get VPN configuration for client
  static async getConfig(req, res) {
    try {
      const { key } = req.params;
      const userId = req.user.id;

      const vpnKey = await VpnKey.findByKey(key);
      if (!vpnKey || vpnKey.user_id !== userId) {
        return res.status(404).json({
          success: false,
          message: 'VPN key not found'
        });
      }

      if (!vpnKey.active) {
        return res.status(403).json({
          success: false,
          message: 'VPN key is inactive'
        });
      }

      // Generate VLESS configuration
      const config = {
        protocol: 'vless',
        uuid: vpnKey.key,
        server: process.env.VLESS_SERVER_HOST,
        port: process.env.VLESS_SERVER_PORT,
        encryption: 'none',
        network: 'ws',
        path: '/vless',
        tls: true,
        sni: process.env.VLESS_SERVER_HOST,
        alpn: ['h2', 'http/1.1']
      };

      res.json({
        success: true,
        data: { config }
      });
    } catch (error) {
      logger.error('Get config error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error getting configuration'
      });
    }
  }
}

module.exports = VpnController;
