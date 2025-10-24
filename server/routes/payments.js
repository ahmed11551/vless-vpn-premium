const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'rub', plan } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to kopecks
      currency: currency,
      metadata: {
        plan: plan,
        userId: req.user?.id || 'anonymous'
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent'
    });
  }
});

// Handle successful payment
router.post('/success', async (req, res) => {
  try {
    const { paymentIntentId, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update user subscription
      const plan = paymentIntent.metadata.plan;
      const subscriptionDuration = getSubscriptionDuration(plan);
      
      // Here you would update the user's subscription in your database
      // await User.updateSubscription(userId, subscriptionDuration);
      
      res.json({
        success: true,
        message: 'Payment successful, subscription activated'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment'
    });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Handle successful payment
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Handle failed payment
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Get pricing plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'basic',
        name: 'Basic',
        price: 300,
        currency: 'RUB',
        duration: 1,
        features: [
          '1 VPN ключ',
          'Доступ к базовым серверам',
          'Техническая поддержка',
          'Безлимитный трафик'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 450,
        currency: 'RUB',
        duration: 2,
        features: [
          '3 VPN ключа',
          'Доступ ко всем серверам',
          'Приоритетная поддержка',
          'Безлимитный трафик',
          'Статистика использования'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 590,
        currency: 'RUB',
        duration: 3,
        features: [
          '5 VPN ключей',
          'Доступ ко всем серверам',
          'VIP поддержка',
          'Безлимитный трафик',
          'Детальная аналитика',
          'Приоритетное подключение'
        ]
      }
    ];

    res.json({
      success: true,
      data: { plans }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting pricing plans'
    });
  }
});

function getSubscriptionDuration(plan) {
  const durations = {
    'basic': 30, // days
    'premium': 60,
    'pro': 90
  };
  return durations[plan] || 30;
}

module.exports = router;
