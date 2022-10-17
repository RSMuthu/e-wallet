const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

/**
 * authenticate Middleware
 * This middleware is used to authenticate/validate the bearer token in the header
 */
async function authenticate (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.auth
  // no token available
  if (!token) return res.status(401).json({ msg: 'Token not Valid' })
  try {
    const user = await jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = user.data
    next()
  } catch (err) {
    logger.error(err)
    next(err)
  }
}

// add `unless` middleware to token validator
authenticate.unless = require('express-unless').unless

/**
 * generateAccessToken Middleware
 * This middleware is used to generate the token for the client to access our resource
 */
function generateAccessToken (info) {
  return jwt.sign({ data: info }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
}

module.exports = {
  authenticate,
  generateAccessToken,
}
