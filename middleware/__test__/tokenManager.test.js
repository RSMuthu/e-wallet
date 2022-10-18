const jwt = require('jsonwebtoken')
const { authenticate } = require('../tokenManager')
const logger = require('../../utils/logger')

describe('Token Manager', () => {
  const mockRequest = {}; const mockResponse = {}; const mockNext = jest.fn()

  describe('authenticate middleware', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      logger.error = jest.fn()
    })

    it('token unavailable', () => {
      mockRequest.headers = {}
      authenticate(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Token not Valid' })
    })

    it('token invalid', () => {
      jwt.verify = jest.fn().mockImplementation(() => { throw new Error('Token invalid') })
      mockRequest.headers = { authorization: 'bearer 1' }
      authenticate(mockRequest, mockResponse, mockNext)
      expect(logger.error).toBeCalledTimes(1)
    })

    it('successfull token validation', () => {
      jwt.verify = jest.fn().mockReturnValue({ data: 1 })
      mockRequest.headers = { authorization: 'bearer 1' }
      authenticate(mockRequest, mockResponse, mockNext)
      expect(logger.error).toBeCalledTimes(0)
      expect(mockRequest.user).toBeExist
    })
  })
})
