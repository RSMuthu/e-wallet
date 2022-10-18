const logger = require('../../utils/logger')
const handler = require('../errorHandler')

describe('Error Handler', () => {
  const mockRequest = {}; const mockResponse = {}; const mockNext = jest.fn()

  beforeEach(() => {
    logger.error = jest.fn()
    mockResponse.status = jest.fn().mockReturnValue(mockResponse)
    mockResponse.json = jest.fn().mockReturnValue(mockResponse)
  })

  it('Custom Error', () => {
    handler('custom error', mockRequest, mockResponse, mockNext)
    expect(mockResponse.status).toBeCalledWith(400)
  })

  it('Token Expiry', () => {
    handler({ name: 'TokenExpiredError' }, mockRequest, mockResponse, mockNext)
    expect(mockResponse.status).toBeCalledWith(401)
  })

  it('Data Validation failure', () => {
    handler({ name: 'ValidationError' }, mockRequest, mockResponse, mockNext)
    expect(mockResponse.status).toBeCalledWith(400)
  })

  it('User unauthorized', () => {
    handler({ name: 'UnauthorizedError' }, mockRequest, mockResponse, mockNext)
    expect(mockResponse.status).toBeCalledWith(401)
  })

  it('duplicate db key', () => {
    handler({ message: 'duplicate key error collection' }, mockRequest, mockResponse, mockNext)
    expect(mockResponse.status).toBeCalledWith(403)
  })

  it('General error handler', () => {
    handler({ message: 'General error scenario' }, mockRequest, mockResponse, mockNext)
    expect(mockResponse.status).toBeCalledWith(500)
  })
})
