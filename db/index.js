const mongoose = require('mongoose')
const logger = require('../utils/logger')

// Mongo DB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', logger.error)
db.once('open', () => logger.info(`Connected to mongo at ${process.env.MONGO_URI}`))

module.exports = db
