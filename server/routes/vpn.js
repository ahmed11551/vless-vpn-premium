const express = require('express');
const { body, param } = require('express-validator');
const VpnController = require('../controllers/VpnController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const generateKeyValidation = [
  body('serverLocation')
    .optional()
    .isIn(['netherlands', 'germany', 'france', 'usa', 'russia', 'kazakhstan'])
    .withMessage('Invalid server location'),
  body('plan')
    .optional()
    .isIn(['basic', 'premium', 'pro'])
    .withMessage('Invalid plan type')
];

const keyIdValidation = [
  param('keyId')
    .isUUID()
    .withMessage('Invalid key ID format')
];

const keyValidation = [
  param('key')
    .matches(/^vless-premium-[a-f0-9-]{36}$/)
    .withMessage('Invalid key format')
];

// Routes
router.post('/generate-key', authMiddleware, generateKeyValidation, VpnController.generateKey);
router.get('/keys', authMiddleware, VpnController.getUserKeys);
router.get('/keys/:keyId', authMiddleware, keyIdValidation, VpnController.getKeyDetails);
router.put('/keys/:keyId/deactivate', authMiddleware, keyIdValidation, VpnController.deactivateKey);
router.get('/locations', authMiddleware, VpnController.getServerLocations);
router.get('/config/:key', authMiddleware, keyValidation, VpnController.getConfig);

module.exports = router;
