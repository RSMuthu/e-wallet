const { createLogger, format, transports } = require('winston')

const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.json(),
    format.timestamp(),
    format.printf((info) => {
      info.request_id = require('express-http-context').get('reqId')
      return info
    }),
    format.prettyPrint(),
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
    }),
  ],
})

module.exports = logger
