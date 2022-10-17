const router = require('express').Router()
const {
  getWallet,
  getWallets,
  updateWallet,
  deleteWallet,
  createWallet,
} = require('../controller/wallet')
const { getTransactions } = require('../controller/transaction')
const validator = require('../middleware/validators')

/**
 * @api {get} /api/v1/wallets/:id/transactions Get the list of all transactions in a wallet
 * @apiName getTransactions
 * @apiGroup Transaction
 *
 * @apiHeader {String} authorization Users unique bearer token
 *
 * @apiQuery {Number} [skip] number of records to skip from start in the transaction list
 * @apiQuery {Number} [limit] number of records to respond
 *
 * @apiParam {string} id Wallet ID
 *
 * @apiSuccess {Object[]} Transaction All Transactions on a wallet.
 * @apiSuccess {String} Transaction.id ID of the transaction made.
 * @apiSuccess {String} Transaction.wallet ID of the wallet.
 * @apiSuccess {String} Transaction.amount the amount debit/credit to the wallet.
 * @apiSuccess {String} Transaction.newBalance new balance of wallet after the transaction.
 * @apiSuccess {String} Transaction.description Description of the transaction.
 * @apiSuccess {String} Transaction.type Type of the transaction made - CREDIT or DEBIT.
 * @apiSuccess {Date} Transaction.transactionDate Timestamp of the transaction made.
 * @apiSuccess {Object} Transaction.user user Info who did transaction on the wallet.
 * @apiSuccess {String} Transaction.user.name name of user who did transaction on the wallet.
 * @apiSuccess {String} Transaction.user.email email of user who did transaction on the wallet.
 * @apiSuccess {String} Transaction.user.id id of user who did transaction on the wallet.
 *
 * @apiError (401) UnAuthorized  Token not valid
 * @apiError (401) TokenExpiredError  Token expired
 * @apiError (404) WalletNotFound  Wallet given is not found
 */
router.get('/:id/transactions', validator.transactionsList, getTransactions)

router.route('/:id')
  /**
   * @api {get} /api/v1/wallets/:id Get the list of all wallets
   * @apiName getWallet
   * @apiGroup Wallet
   *
   * @apiHeader {String} authorization Users unique bearer token
   *
   * @apiParam {string} id Wallet ID
   *
   * @apiSuccess {Object} Wallet Wallet information.
   * @apiSuccess {Number} Wallet.balance Balance amount available in wallet.
   * @apiSuccess {String} Wallet.id Wallet's id.
   * @apiSuccess {Object} Wallet.owner User info of who owns the wallet.
   * @apiSuccess {String} Wallet.owner.role Role of the wallet owner.
   * @apiSuccess {String} Wallet.owner.email email of the wallet owner.
   * @apiSuccess {String} Wallet.owner.name name of the wallet owner.
   * @apiSuccess {String} Wallet.owner.id user ID of the wallet owner.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   * @apiError (404) WalletNotFound  Wallet given is not found
   */
  .get(getWallet)
  /**
   * @api {patch} /api/v1/wallets/:id Make transactions to a wallet
   * @apiName updateWallet
   * @apiGroup Wallet
   *
   * @apiHeader {String} authorization Users unique bearer token
   *
   * @apiParam {string} id User id
   *
   * @apiBody {String} amount Amount to update on the Wallet balance.
   * @apiBody {String} [description] Description for the transaction made.
   *
   * @apiSuccess {Object} Wallet Wallet Information.
   * @apiSuccess {String} Wallet.id Wallet's ID.
   * @apiSuccess {Number} Wallet.amount User inputed update amount.
   * @apiSuccess {String} Wallet.newBalance Updated new balance of the wallet.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   * @apiError (422) UnproccessableEntity  Some madatory required fields not provided
   * @apiError (400) ValidationError  Data validation failure
   * @apiError (404) WalletNotFound  User given is not found
   */
  .patch(validator.transact, updateWallet)
  /**
   * @api {delete} /api/v1/users/:id Delete a single user
   * @apiName deleteUser
   * @apiGroup User
   *
   * @apiHeader {String} authorization Users unique bearer token
   *
   * @apiParam {string} id User id
   *
   * @apiSuccess {String} msg Stating 'Wallet has been removed'.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   * @apiError (403) ForbidNonZeroWalletDeletion  Non-Zero balance Wallet cannot be deleted
   * @apiError (404) WalletNotFound  Wallet given is not found
   */
  .delete(deleteWallet)

router.route('/')
  /**
   * @api {get} /api/v1/wallets/ Get the list of all wallets
   * @apiName getWallets
   * @apiGroup Wallet
   *
   * @apiHeader {String} authorization Users unique bearer token
   *
   * @apiSuccess {Object[]} Wallet Wallet information.
   * @apiSuccess {Number} Wallet.balance Balance amount available in wallet.
   * @apiSuccess {String} Wallet.id Wallet's id.
   * @apiSuccess {Object} Wallet.owner User info of who owns the wallet.
   * @apiSuccess {String} Wallet.owner.role Role of the wallet owner.
   * @apiSuccess {String} Wallet.owner.email email of the wallet owner.
   * @apiSuccess {String} Wallet.owner.name name of the wallet owner.
   * @apiSuccess {String} Wallet.owner.id user ID of the wallet owner.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   */
  .get(getWallets)
  /**
   * @api {post} /api/v1/wallets/ Create a Wallet for the user
   * @apiName createWallet
   * @apiGroup Wallet
   *
   * @apiBody {Number} [balance] Balance with which wallet is to be created.
   *
   * @apiSuccess {String} msg Stating 'Wallet created'.
   *
   * @apiError (401) UnAuthorized  Token not valid
   * @apiError (401) TokenExpiredError  Token expired
   * @apiError (400) ValidationError  Data validation failure
   */
  .post(validator.wallet, createWallet)

module.exports = router
