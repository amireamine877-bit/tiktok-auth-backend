const jwt = require('jsonwebtoken');

function sign(payload, expiresIn = '7d') {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn });
}

function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}

module.exports = { sign, verify };
