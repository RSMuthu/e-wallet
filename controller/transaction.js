const Transaction = require('../db/models/transaction')
const Wallet = require('../db/models/wallet')

// middleware to Get the list of all transactions for a wallet
exports.getTransactions = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ id: req.params.id })

    // A invalid wallet id in URL
    if (wallet === null) return res.status(404).json({ msg: 'Resource does not exist' })
    // Unauthorized user who dont have access to this wallet id
    if (req.user.role !== 'admin' && wallet.ownerId !== req.user.id) {
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }

    // Fetch all the transactions of a wallet based on `skip` and `limit` in url
    const transaction = await Transaction.find({ wallet: req.params.id })
      .sort({ createdAt: 1 })
      .skip(req.query.skip)
      .limit(req.query.limit)
      .populate({ path: 'user', select: 'id email name' })
    res.status(200).json({ data: transaction })
  } catch (error) {
    next(error)
  }
}
