// backend/utils/hibp.js
const axios = require('axios');
const crypto = require('crypto');

async function checkPasswordPwned(password) {
  // compute SHA-1
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const url = `https://api.pwnedpasswords.com/range/${prefix}`;

  const res = await axios.get(url);
  // Parse response lines
  const lines = res.data.split('\r\n');
  for (const line of lines) {
    if (!line) continue;
    const [hashSuffix, countStr] = line.split(':');
    if (hashSuffix === suffix) {
      return { found: true, count: parseInt(countStr || '0', 10) };
    }
  }
  return { found: false, count: 0 };
}

function riskLevelFromCount(count) {
  if (count === 0) return 'Safe';
  if (count <= 1000) return 'Moderate';
  return 'High';
}

function dynamicRemedies(count, email) {
  const level = riskLevelFromCount(count);
  const base = [
    'Change password immediately.',
    'Use a unique passphrase (>=12 chars) with numbers & symbols.',
    'Enable Two-Factor Authentication (2FA) where possible.',
    'Do not reuse passwords across sites.'
  ];
  if (level === 'Safe') {
    return ['Password not found in HIBP ranges. Still: enable 2FA & use strong passwords.'];
  }
  if (level === 'Moderate') {
    return base.concat([`Check accounts associated with ${email} for suspicious activity.`]);
  }
  return base.concat([
    'Check your connected email accounts and revoke suspicious sessions.',
    `Reset passwords for critical services linked to ${email} first.`
  ]);
}

module.exports = { checkPasswordPwned, riskLevelFromCount, dynamicRemedies };
