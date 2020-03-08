const {
  createLogger,
  format,
  transports
} = require('winston');

function getLoggingLevel() {
  if (process.env.NODE_ENV === 'production') {
    return 'info';
  }
  return 'debug';
}

const logger = createLogger({
  level: getLoggingLevel(),
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'clippy' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

module.exports = logger;
