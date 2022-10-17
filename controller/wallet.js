const Wallet = require('../db/models/wallet')
const Transaction = require('../db/models/transaction')

// middleware to Get the list of all wallets
exports.getWallets = async (req, res, next) => {
  try {
    // list all wallets available if user is admin
    // Or else, list only wallets associated with user
    const filter = req.user.role !== 'admin' ? { owner: req.user.id } : {}
    const wallets = await Wallet.find(filter)
      .populate({ path: 'owner', select: 'email name role' })
      .select('id owner balance')

    res.status(200).json({ data: wallets })
  } catch (error) {
    next(error)
  }
}

// middleware to create a wallet
exports.createWallet = async (req, res, next) => {
  try {
    // one user can only have a maximum of 2 wallets
    const walletCount = await Wallet.countDocuments({ owner: req.user.id })
    if (walletCount >= 2) return res.status(403).json({ msg: 'You cannot add more than 2 wallets' })

    const wallet = new Wallet({ owner: req.user.id, balance: req.body?.balance })
    await wallet.save()

    res.status(201).json({ data: wallet })
  } catch (error) {
    next(error)
  }
}

// middleware to get details of a wallet
exports.getWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findById(req.params.id)
      .populate({ path: 'owner', select: 'email name role' })
      .select('id owner balance')

    // check if wallet exists
    if (wallet === null) return res.status(404).json({ msg: 'Resource does not exist' })
    // check if user has necessary authorisation over the wallet
    if (req.user.role !== 'admin' && wallet.owner !== req.user.id) {
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }

    res.status(200).json({ data: wallet })
  } catch (error) {
    next(error)
  }
}

// middleware to make a transaction on a wallet
exports.updateWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findById(req.params.id)
      .select('id owner balance')

    // check if wallet exists
    if (wallet === null) return res.status(404).json({ msg: 'Resource does not exist' })
    // check if user has necessary authorisation over the wallet
    if (req.user.role !== 'admin' && wallet.owner !== req.user.id) {
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }

    // Check if amount change causing overdraft
    const newBalance = wallet.balance + req.body.amount
    if (newBalance < 0) return res.status(403).json({ msg: 'You are Forbidden from this action' })
    wallet.balance = newBalance
    // Make an entry to the transaction collection
    const transaction = new Transaction({
      wallet: wallet.id,
      user: req.user.id,
      amount: req.body.amount,
      description: req.body.description ?? '',
      newBalance,
    })
    await transaction.save()
    await wallet.save() // update wallet iff transaction is successful

    const responseObj = { walletId: wallet.id, amount: req.body.amount, newBalance }
    res.status(200).json({ data: responseObj })
  } catch (error) {
    next(error)
  }
}

// middleware to delete a wallet
exports.deleteWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findById(req.params.id)
      .select('id owner balance')

    // check if wallet exists
    if (wallet === null) return res.status(404).json({ msg: 'Resource does not exist' })
    // check if user has necessary authorisation over the wallet
    if (req.user.role !== 'admin' && wallet.owner !== req.user.id) {
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }

    // non-zero balance wallet cannot be deleted
    if (wallet.balance > 0) {
      return res.status(403).json({ msg: 'You are forbidden from deleting non-zero balance wallet' })
    }

    await wallet.remove()
    // Remove the transaction associated with the wallet removed
    await Transaction.find({ walletId: wallet.id }).remove()
    res.status(200).json({ msg: 'Wallet has been removed' })
  } catch (error) {
    next(error)
  }
}
