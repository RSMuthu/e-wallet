const express = require('express')
const path = require('path')
const httpContext = require('express-http-context')
const expressLogger = require('express-winston')
const logger = require('./utils/logger')
require('./db')

const app = express()

app.disable('x-powered-by') // Disable x-powered-by header for security
app.use(require('compression')()) // add gzip content encoding
app.use(require('cors')()) // enable cors

// Setup request Id for all incoming request
app.use(httpContext.middleware)
app.use((req, res, next) => {
  // use uuid v4 for req ID
  httpContext.set('reqId', require('uuid').v4())
  next()
})

// Setup logging from server
app.use(expressLogger.logger({ winstonInstance: logger }))
app.use(
  expressLogger.errorLogger({
    winstonInstance: logger,
    dumpExceptions: true,
    showStack: true,
  }),
)

// Setup necessary cookie parser and other middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('cookie-parser')())

app.use('/docs', express.static('docs'))

// Add Auth middleware
app.use(
  require('./middleware/tokenManager').authenticate.unless(function (req) {
    return (
      req.originalUrl.includes('/api/v1/signin') ||
      req.originalUrl.includes('/api/v1/signup')
    )
  }),
)

// Route endpoints
app.use(require('./routes'))
// a minimal Error handler to throw appropriate status code
app.use(require('./utils/errorHandler'))

// Static exposure
// app.use(express.static(path.join(__dirname, 'build')))
// app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'build', 'index.html')))

// At last, handle all uncaught errors -- if any unnoticed corner case occurs
process.on('uncaughtException', (error) => {
  logger.error('app: Global error', error)
})

module.exports = app
