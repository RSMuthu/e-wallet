const Joi = require('joi')

// Expected payload structure for Wallet creation
const create = Joi.object().keys({
  balance: Joi.number().precision(2).min(0),
})

// Expected payload structure for Wallet transaction
const update = Joi.object().keys({
  amount: Joi.number().precision(2).invalid(0).required(),
  description: Joi.string(),
})

module.exports = {
  create,
  update,
}
