const logger = require('../utils/logger')

const handler = (err, req, res, next) => {
  // custom errors
  logger.error(err)
  if (typeof (err) === 'string') return res.status(400).json({ msg: err })
  if (err.name === 'TokenExpiredError') return res.status(401).json({ msg: 'Token Expired' })
  if (err.name === 'ValidationError') return res.status(400).json({ msg: err.message })
  if (err.name === 'UnauthorizedError') return res.status(401).json({ msg: 'Token not valid' })
  if (err.message.includes('duplicate key error collection')) {
    return res.status(403).json({ msg: 'Resource key already exists' })
  }
  // defaulting all other errors to 500 status
  return res.status(500).json({ msg: err.message })
}

module.exports = handler
