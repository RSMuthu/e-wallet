const Joi = require('joi')

// Expected payload structure for register
const signup = Joi.object().keys({
  email: Joi.string().email().trim(true).required(),
  password: Joi.string().min(6).max(128).required(),
  name: Joi.string().trim(true).min(4).max(128).required(),
  role: Joi.string().valid('customer', 'admin'),
})

// Expected payload structure for login
const signin = Joi.object().keys({
  email: Joi.string().email().trim(true).required(),
  password: Joi.string().min(6).max(128).required(),
})

module.exports = {
  signup,
  signin,
}
