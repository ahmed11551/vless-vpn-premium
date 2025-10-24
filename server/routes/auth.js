const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('telegramId')
    .optional()
    .isNumeric()
    .withMessage('Telegram ID must be a number'),
  body('referralCode')
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage('Referral code must be 8 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const linkTelegramValidation = [
  body('telegramId')
    .isNumeric()
    .withMessage('Telegram ID must be a number')
];

// Routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.post('/link-telegram', authMiddleware, linkTelegramValidation, AuthController.linkTelegram);

module.exports = router;
