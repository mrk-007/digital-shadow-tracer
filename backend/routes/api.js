// backend/routes/api.js
const express = require('express');
const router = express.Router();
const { verifyEmail, scanPassword } = require('../controllers/scanController');

router.post('/verify-email', verifyEmail);
router.post('/scan-password', scanPassword);

module.exports = router;
