const router = require('express').Router()
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controller/user')
const validator = require('../middleware/validators')

router.route('/:id')
  /**
   * @api {get} /api/v1/users/:id Get details of a single user
   * @apiName getUser
   * @apiGroup User
   *
   * @apiHeader {String} authorization Users unique bearer token
   *
   * @apiParam {string} id User id
   *
   * @apiSuccess {Object} User User information.
   * @apiSuccess {String} User.id User ID.
   * @apiSuccess {String} User.email User email id.
   * @apiSuccess {String} User.name User name.
   * @apiSuccess {String} User.role Role of the User.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   * @apiError (404) UserNotFound  User given is not found
   */
  .get(getUser)
  /**
   * @api {patch} /api/v1/users/:id Update details of a single user
   * @apiName updateUser
   * @apiGroup User
   *
   * @apiHeader {String} authorization Users unique bearer token
   *
   * @apiParam {string} id User id
   *
   * @apiBody {String} [email] User email.
   * @apiBody {String} [name] User name.
   * @apiBody {String} [password] User password.
   * @apiBody {String} [role] User's role.
   *
   * @apiSuccess {Object} User User Information.
   * @apiSuccess {String} User.id User ID.
   * @apiSuccess {String} User.email User email id.
   * @apiSuccess {String} User.name User name.
   * @apiSuccess {String} User.role Role of the User.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   * @apiError (422) UnproccessableEntity  Some madatory required fields not provided
   * @apiError (400) ValidationError  Data validation failure
   * @apiError (403) DuplicateKeyError Resource key already exists
   * @apiError (404) UserNotFound  User given is not found
   */
  .patch(validator.customer, updateUser)
  /**
   * @api {delete} /api/v1/users/:id Delete a single user
   * @apiName deleteUser
   * @apiGroup User
   *
   * @apiHeader {String} authorization Users unique bearer token
   *
   * @apiParam {string} id User id
   *
   * @apiSuccess {String} msg Stating 'User has been removed'.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   * @apiError (404) UserNotFound  User given is not found
   */
  .delete(deleteUser)

/**
 * @api {get} /api/v1/users/ Get the list of all users
 * @apiName getUsers
 * @apiGroup User
 *
 * @apiHeader {String} authorization Users unique bearer token
 *
 * @apiSuccess {Object[]} User User information.
 * @apiSuccess {String} User.id User ID.
 * @apiSuccess {String} User.email User email id.
 * @apiSuccess {String} User.name User name.
 * @apiSuccess {String} User.role Role of the User.
 *
 * @apiError (401) UnAuthorized  Token not valid
 * @apiError (401) TokenExpiredError  Token expired
 */
router.get('/', getUsers)

module.exports = router
