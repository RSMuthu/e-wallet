const authSchema = require('./auth')
const userSchema = require('./user')
const walletSchema = require('./wallet')
const transactionSchema = require('./wallet')

/* BodyValidator Middleware
 * A Validator middleware to apply joi validation
 * on the request body on server calls
 */
const validator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) return res.status(422).json({ msg: error.details[0].message })
  next()
}

/* QueryValidator Middleware
 * A Validator middleware to apply joi validation
 * on the request query on server calls
 */
const queryValidator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query)
  if (error) return res.status(422).json({ msg: error.details[0].message })
  next()
}

module.exports = {
  signup: validator(authSchema.signup),
  signin: validator(authSchema.signin),
  customer: validator(userSchema.update),
  wallet: validator(walletSchema.create),
  transact: validator(walletSchema.update),
  transactionsList: validator(transactionSchema.list)
}
