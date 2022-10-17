const Joi = require('joi')

// Validator for skip and limit for pagination url
const list = Joi.object().keys({
  skip: Joi.Number().positive(),
  limit: Joi.Number().positive(),
})

module.exports = {
  list,
}
