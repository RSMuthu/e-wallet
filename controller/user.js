const User = require('../db/models/user')

// middleware to Get the list of all users
exports.getUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      // Only admin can see through all the users details
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }

    const cust = await User.find()
      .select('id name email role')
    res.status(200).json({ data: cust })
  } catch (error) {
    next(error)
  }
}

// middleware to Get details of a user
exports.getUser = async (req, res, next) => {
  try {
    // check if user has necessary authorisation over this User details
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }

    const cust = await User.findById(req.params.id)
      .select('id name email role')
    // Check if User exists
    if (cust === null) return res.status(404).json({ msg: 'Resource does not exist' })

    res.status(200).json({ data: cust })
  } catch (error) {
    next(error)
  }
}

// middleware to update details of a user
exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      // user can only update their own info unless user is admin
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }
    if (req.user.role !== 'admin' && req.body.role === 'admin') {
      // only admin users can change others role
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }

    const cust = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    // check if User exists
    if (cust === null) return res.status(404).json({ msg: 'Resource does not exist' })
    await cust.save()
    res.status(200).json({ data: cust })
  } catch (error) {
    next(error)
  }
}

// middleware to delete a User
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      // user can only delete their own info or else user must be admin
      return res.status(401).json({ msg: 'You are unauthorized to this resource' })
    }
    await User.findByIdAndRemove(req.params.id)

    res.status(200).json({ msg: 'User has been removed' })
  } catch (error) {
    next(error)
  }
}
