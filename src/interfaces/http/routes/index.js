const { Router } = require('express');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

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
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router;

