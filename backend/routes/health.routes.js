const express = require('express');
const router = express.Router();


router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API FastCube est opérationnelle',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

module.exports = router;













