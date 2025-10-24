const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../utils/logger');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, telegramId, referralCode } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const userData = {
        email,
        password: hashedPassword,
        telegram_id: telegramId || null,
        role: 'user',
        subscription_active: false,
        subscription_expires_at: null,
        referral_code: this.generateReferralCode(),
        referred_by: referralCode ? await this.getUserIdByReferralCode(referralCode) : null
      };

      const user = await User.create(userData);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            telegramId: user.telegram_id,
            role: user.role,
            subscriptionActive: user.subscription_active,
            referralCode: user.referral_code
          },
          token
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            telegramId: user.telegram_id,
            role: user.role,
            subscriptionActive: user.subscription_active,
            subscriptionExpiresAt: user.subscription_expires_at,
            referralCode: user.referral_code
          },
          token
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
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
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error getting profile'
      });
    }
  }

  // Link Telegram account
  static async linkTelegram(req, res) {
    try {
      const { telegramId } = req.body;

      // Check if Telegram ID is already linked to another user
      const existingUser = await User.findByTelegramId(telegramId);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({
          success: false,
          message: 'This Telegram account is already linked to another user'
        });
      }

      const user = await User.update(req.user.id, { telegram_id: telegramId });

      res.json({
        success: true,
        message: 'Telegram account linked successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            telegramId: user.telegram_id
          }
        }
      });
    } catch (error) {
      logger.error('Link Telegram error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error linking Telegram account'
      });
    }
  }

  // Helper methods
  static generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async getUserIdByReferralCode(referralCode) {
    const user = await User.findByReferralCode(referralCode);
    return user ? user.id : null;
  }
}

module.exports = AuthController;
