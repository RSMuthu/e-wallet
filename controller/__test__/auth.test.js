const User = require('../../db/models/user')
const TokenManager = require('../../middleware/tokenManager')
const { login, register, logout } = require('../auth')

describe('Auth Controller', () => {
  const mockRequest = {}
  const mockResponse = {}
  const mockNext = jest.fn()

  describe('Login process', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      mockResponse.cookie = jest.fn()
      TokenManager.generateAccessToken = jest.fn().mockImplementation(() => { return '123' })
    })

    it('Invalid password throws unauthorized status', async () => {
      User.findOne = jest.fn().mockImplementation(() => {
        return {
          isPasswdMatch: jest.fn().mockImplementation(() => { return false }),
        }
      })
      mockRequest.body = { email: 'x', password: '1' }
      await login(mockRequest, mockResponse, mockNext)
      expect(mockNext).toBeCalledTimes(0)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Incorrect email or password' })
      expect(mockResponse.cookie).toBeCalledTimes(0)
    })

    it('Invalid login email - throws unauthorized status', async () => {
      User.findOne = jest.fn().mockImplementation(() => {
        return null
      })
      mockRequest.body = { email: 'x', password: '1' }
      await login(mockRequest, mockResponse, mockNext)
      expect(mockNext).toBeCalledTimes(0)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Incorrect email or password' })
      expect(mockResponse.cookie).toBeCalledTimes(0)
    })

    it('Valid flow - sets cookie and send success status', async () => {
      User.findOne = jest.fn().mockImplementation(() => {
        return {
          isPasswdMatch: jest.fn().mockReturnValue(true),
          toJSON: jest.fn().mockReturnValue({ data: '123' }),
        }
      })
      mockRequest.body = { email: 'x', password: '1' }
      await login(mockRequest, mockResponse, mockNext)
      expect(mockNext).toBeCalledTimes(0)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
      expect(mockResponse.cookie).toBeCalledTimes(1)
    })
  })

  describe('Register Process', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      User.prototype.save = jest.fn()
    })

    it('Valid admin role registeration', async () => {
      mockRequest.body = { role: 'admin' }
      mockRequest.user = { role: 'admin' }
      await register(mockRequest, mockResponse, mockNext)
      expect(mockNext).toBeCalledTimes(0)
      expect(User.prototype.save).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(201)
      expect(mockResponse.json).toBeCalledWith({ msg: 'user created' })
    })

    it('Invalid admin role registration', async () => {
      mockRequest.body = { role: 'admin' }
      mockRequest.user = { role: 'customer' }
      await register(mockRequest, mockResponse, mockNext)
      expect(mockNext).toBeCalledTimes(0)
      expect(User.prototype.save).toBeCalledTimes(0)
      expect(mockResponse.status).toBeCalledWith(400)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Bad user role' })
    })

    it('Valid customer role registration', async () => {
      mockRequest.body = { role: 'customer' }
      await register(mockRequest, mockResponse, mockNext)
      expect(mockNext).toBeCalledTimes(0)
      expect(User.prototype.save).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(201)
      expect(mockResponse.json).toBeCalledWith({ msg: 'user created' })
    })

    it('duplicate Email registration', async () => {
      User.prototype.save = jest.fn().mockImplementation(() => { throw new Error('test') })
      mockRequest.body = { role: 'customer' }
      await register(mockRequest, mockResponse, mockNext)
      expect(User.prototype.save).toBeCalledTimes(1)
      expect(mockNext).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledTimes(0)
      expect(mockResponse.json).toBeCalledTimes(0)
    })
  })

  describe('Logout Process', () => {
    beforeEach(() => {
      mockResponse.clearCookie = jest.fn()
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      User.prototype.save = jest.fn()
    })

    it('Clear token from client resource', () => {
      mockRequest.headers = { authorization: '' }
      logout(mockRequest, mockResponse, {})
      expect(mockResponse.clearCookie).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are logged out successfully' })
      expect(mockRequest.headers.authorization).toBe(undefined)
    })
  })
})
