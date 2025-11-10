const { Router } = require('express');

const authRoutes = require('./authRoutes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Service healthy',
    object: { timestamp: new Date().toISOString() },
    errors: null,
  });
});

router.use('/auth', authRoutes);

module.exports = router;

