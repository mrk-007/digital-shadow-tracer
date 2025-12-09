// backend/controllers/scanController.js
const dns = require('dns').promises;
const { checkPasswordPwned, riskLevelFromCount, dynamicRemedies } = require('../utils/hibp');
// const ScanLog = require('../models/scanLog'); // optional

async function verifyEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.json({ exists: false, reason: 'invalid_format' });

    const domain = email.split('@')[1];
    try {
      const mx = await dns.resolveMx(domain);
      const exists = Array.isArray(mx) && mx.length > 0;
      return res.json({ exists });
    } catch (err) {
      return res.json({ exists: false, reason: 'mx_not_found' });
    }
  } catch (err) {
    console.error('verifyEmail error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function scanPassword(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // NEVER store raw password
    const { found, count } = await checkPasswordPwned(password);
    const risk = riskLevelFromCount(count);
    const remedies = dynamicRemedies(count, email);

    // Optional: save scan metadata (no raw password)
    // await ScanLog.create({ email, found, count, risk });

    return res.json({
      found,
      count,
      risk,
      remedies,
      message: found ? 'Password appears in breach datasets' : 'Password not found in HIBP ranges'
    });
  } catch (err) {
    console.error('scanPassword error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { verifyEmail, scanPassword };
