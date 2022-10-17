const router = require('express').Router()
const {
  login,
  register,
  logout,
} = require('../controller/auth')

const validator = require('../middleware/validators')

/**
 * @api {post} /api/v1/signup Signup Logic
 * @apiName Register
 * @apiGroup Auth
 *
 * @apiBody {String} email User email.
 * @apiBody {String} name User name.
 * @apiBody {String} password User password.
 * @apiBody {String} [role] User's role.
 *
 * @apiSuccess {String} msg Stating 'User created'.
 *
 * @apiError (400) ValidationError  Data validation failure
 * @apiError (422) UnproccessableEntity  Some madatory required fields not provided
 * @apiError (403) DuplicateKeyError Resource key already exists
 */
router.post('/signup', validator.signup, register)
/**
 * @api {post} /api/v1/signin Signin Logic
 * @apiName login
 * @apiGroup Auth
 *
 * @apiBody {String} email User email.
 * @apiBody {String} password User password.
 *
 * @apiSuccess {Object} User User Information.
 * @apiSuccess {String} User.email User email.
 * @apiSuccess {String} User.name  name of the User.
 * @apiSuccess {String} User.role  role of the User.
 * @apiSuccess {String} User.token  Access token of the User.
 *
 * @apiError (401) UnAuthorized  Incorrect email or password
 * @apiError (422) UnproccessableEntity  Some madatory required fields not provided
 */
router.post('/signin', validator.signin, login)
/**
 * @api {post} /api/v1/signout Signout Logic
 * @apiName Logout
 * @apiGroup Auth
 *
 * @apiHeader {String} authorization Users unique bearer token
 *
 * @apiSuccess {String} msg Stating 'User logged out'.
 *
 * @apiError (401) UnAuthorized  Token not valid
 * @apiError (401) TokenExpiredError  Token expired
 * @apiError (403) DuplicateKeyError Resource key already exists
 */
router.post('/signout', logout)

module.exports = router
