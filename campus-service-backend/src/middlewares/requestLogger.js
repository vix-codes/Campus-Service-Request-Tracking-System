const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info('%s %s %s', req.ip || req.connection.remoteAddress, req.method, req.originalUrl);
  next();
};

module.exports = requestLogger;
