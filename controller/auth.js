const User = require('../db/models/user')
const TokenManager = require('../middleware/tokenManager')

// Login/signin logic
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const cust = await User.findOne({ email })

    if (cust?.isPasswdMatch(password)) {
      const token = TokenManager.generateAccessToken({ email, role: cust.role, id: cust.id })
      res.cookie('auth', token, {
        httpOnly: true,
        secure: true,
      })
      res.status(200).json({ ...cust.toJSON(), token })
    } else {
      res.status(401).json({ msg: 'Incorrect email or password' })
    }
  } catch (error) {
    next(error)
  }
}

// Register/signup logic
exports.register = async (req, res, next) => {
  // Only admins can signup for another admin
  if (req.body.role === 'admin' && req.user?.role !== 'admin') return res.status(400).json({ msg: 'Bad user role' })
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).json({ msg: 'user created' })
  } catch (error) {
    next(error)
  }
}

// Logout logic
exports.logout = (req, res, next) => {
  res.clearCookie('auth')
  delete req.headers.authorization
  res.status(200).json({ msg: 'You are logged out successfully' })
}
