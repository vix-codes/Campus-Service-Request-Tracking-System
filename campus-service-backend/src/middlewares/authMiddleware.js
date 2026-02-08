const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      logger.warn('Request without Authorization header: %s %s', req.method, req.originalUrl);
      return res.status(401).json({ message: 'No token' });
    }

    const secret = process.env.JWT_SECRET || 'secretkey';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (err) {
    logger.error('Auth error: %s', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
