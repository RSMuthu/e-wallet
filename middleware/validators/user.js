const Joi = require('joi')

// Expected payload structure for Customer updates
const update = Joi.object().keys({
  email: Joi.string().email().trim(true),
  password: Joi.string().min(6).max(128),
  name: Joi.string().trim(true).min(4).max(128),
  role: Joi.string().valid('customer', 'admin'),
}).or('email', 'password', 'name', 'role')

module.exports = {
  update,
}
