const express = require('express');
const router = express.Router();

// Webhook endpoint for Telegram bot
router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Process Telegram webhook update
    console.log('Received Telegram update:', update);
    
    // Here you would process the webhook and respond to the bot
    // This will be implemented in the bot service
    
    res.json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
