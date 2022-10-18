const User = require('../../db/models/user')
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../user')

describe('User controller', () => {
  const mockRequest = {}
  const mockResponse = {}
  const mockNext = jest.fn()

  describe('List all users', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      const userData = {
        toJSON: jest.fn(),
      }
      User.find = jest.fn().mockReturnValue(userData)
      userData.select = jest.fn().mockReturnValue(userData)
    })

    it('fail if not admin', async () => {
      mockRequest.user = { role: 'customer' }
      await getUsers(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('successful fetch', async () => {
      mockRequest.user = { role: 'admin' }
      await getUsers(mockRequest, mockResponse, mockNext)
      expect(User.find).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })

  describe('Fetch single user', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      const userData = {
        toJSON: jest.fn(),
      }
      User.findByIdAndUpdate = jest.fn().mockReturnValue(userData)
      User.findByIdAndRemove = jest.fn()
      User.findById = jest.fn().mockReturnValue(userData)
      userData.select = jest.fn().mockReturnValue(userData)
    })

    it('Non-authenticative user', async () => {
      mockRequest.user = { role: 'customer', id: 2 }
      mockRequest.params = { id: 1 }
      // user id not match
      await getUser(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('Valid feltch flow for admin user', async () => {
      // authentic user
      mockRequest.params = { id: 1 }
      mockRequest.user = { role: 'admin', id: 2 }
      await getUser(mockRequest, mockResponse, mockNext)
      expect(User.findById).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })

    it('Valid fetch flow for self', async () => {
      // authentic user
      mockRequest.params = { id: 1 }
      mockRequest.user = { role: 'customer', id: 1 }
      await getUser(mockRequest, mockResponse, mockNext)
      expect(User.findById).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })

  describe('Update User', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      const userData = {
        toJSON: jest.fn(),
        save: jest.fn(),
      }
      User.findByIdAndUpdate = jest.fn().mockReturnValue(userData)
      userData.select = jest.fn().mockReturnValue(userData)
    })

    it('Update to "admin" role by non-admin user', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.body = { role: 'admin' }
      mockRequest.user = { role: 'customer', id: 1 }
      await updateUser(mockRequest, mockResponse, mockNext)
      expect(User.findByIdAndUpdate).toBeCalledTimes(0)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('update by non-authenticative user', async () => {
      mockRequest.user = { role: 'customer', id: 2 }
      mockRequest.params = { id: 1 }
      // user id not match
      await updateUser(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('User not found', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.body = { role: 'admin' }
      mockRequest.user = { role: 'admin', id: 1 }
      User.findByIdAndUpdate = jest.fn().mockReturnValue(null)
      await updateUser(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(404)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Resource does not exist' })
    })

    it('User successfull update', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.body = { email: 'abc@xyz.com' }
      mockRequest.user = { role: 'customer', id: 1 }
      await updateUser(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })

  describe('Delete User', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      User.findByIdAndRemove = jest.fn()
    })

    it('unauthorised delete', async () => {
      mockRequest.user = { role: 'customer', id: 1 }
      mockRequest.params = { id: 2 }
      await deleteUser(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('successful deletion by admin', async () => {
      mockRequest.user = { role: 'admin', id: 1 }
      mockRequest.params = { id: 2 }
      await deleteUser(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledWith({ msg: 'User has been removed' })
    })

    it('successful deletion by normal user', async () => {
      mockRequest.user = { role: 'customer', id: 1 }
      mockRequest.params = { id: 1 }
      await deleteUser(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledWith({ msg: 'User has been removed' })
    })
  })
})
