const router = require('express').Router()

const userRoute = require('./user')
const authRoute = require('./auth')
const walletRoute = require('./wallet')

router.use('/api/v1/users', userRoute)
router.use('/api/v1/wallets', walletRoute)
router.use('/api/v1', authRoute)

module.exports = router
