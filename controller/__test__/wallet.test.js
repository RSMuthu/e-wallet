const Wallet = require('../../db/models/wallet')
const Transaction = require('../../db/models/transaction')
const {
  getWallet,
  getWallets,
  updateWallet,
  deleteWallet,
  createWallet,
} = require('../wallet')

describe('Wallet controller', () => {
  const mockRequest = {}
  const mockResponse = {}
  const mockNext = jest.fn()

  describe('Create wallet', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      Wallet.prototype.save = jest.fn()
    })

    it('forbid more than 2 wallets for a user', async () => {
      mockRequest.user = { id: 1 }
      Wallet.countDocuments = jest.fn().mockReturnValue(2)
      await createWallet(mockRequest, mockResponse, mockNext)
      expect(Wallet.prototype.save).toBeCalledTimes(0)
      expect(mockResponse.status).toBeCalledWith(403)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You cannot add more than 2 wallets' })
    })

    it('successfull creation', async () => {
      mockRequest.user = { id: 1 }
      Wallet.countDocuments = jest.fn().mockReturnValue(1)
      await createWallet(mockRequest, mockResponse, mockNext)
      expect(Wallet.prototype.save).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(201)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })

  describe('Get All wallets', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      const walletData = {
        toJSON: jest.fn(),
      }
      Wallet.find = jest.fn().mockReturnValue(walletData)
      walletData.populate = jest.fn().mockReturnValue(walletData)
      walletData.select = jest.fn().mockReturnValue(walletData)
    })

    it('call from admin', async () => {
      mockRequest.user = { role: 'admin', id: 1 }
      await getWallets(mockRequest, mockResponse, mockNext)
      expect(Wallet.find).toBeCalledWith({})
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })

    it('call from normal user', async () => {
      mockRequest.user = { role: 'customer', id: 1 }
      await getWallets(mockRequest, mockResponse, mockNext)
      expect(Wallet.find).toBeCalledWith({ owner: 1 })
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })

  describe('Get single wallet info', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      const walletData = {
        toJSON: jest.fn(),
      }
      Wallet.findById = jest.fn().mockReturnValue(walletData)
      walletData.populate = jest.fn().mockReturnValue(walletData)
      walletData.select = jest.fn().mockReturnValue(walletData)
    })

    it('call from admin', async () => {
      mockRequest.user = { role: 'admin', id: 1 }
      mockRequest.params = { id: 1 }

      await getWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })

    it('wallet not found', async () => {
      const walletData = {}
      Wallet.findById = jest.fn().mockReturnValue(walletData)
      walletData.populate = jest.fn().mockReturnValue(walletData)
      walletData.select = jest.fn().mockReturnValue(null)
      mockRequest.params = { id: 1 }

      await getWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(404)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Resource does not exist' })
    })

    it('wallet fetch by unauthorised user', async () => {
      const walletData = { owner: 2 }
      Wallet.findById = jest.fn().mockReturnValue(walletData)
      walletData.populate = jest.fn().mockReturnValue(walletData)
      walletData.select = jest.fn().mockReturnValue(walletData)
      mockRequest.user = { role: 'customer', id: 1 }
      mockRequest.params = { id: 1 }

      await getWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('wallet succesfull fetch by normal user', async () => {
      const walletData = { owner: 1 }
      Wallet.findById = jest.fn().mockReturnValue(walletData)
      walletData.populate = jest.fn().mockReturnValue(walletData)
      walletData.select = jest.fn().mockReturnValue(walletData)
      mockRequest.user = { role: 'customer', id: 1 }
      mockRequest.params = { id: 1 }

      await getWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })

  describe('Delete Wallet', () => {
    const walletData = {}

    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      walletData.toJSON = jest.fn()
      walletData.remove = jest.fn()
      Wallet.findById = jest.fn().mockReturnValue(walletData)
      walletData.select = jest.fn().mockReturnValue(walletData)
    })

    it('Wallet not found', async () => {
      walletData.select = jest.fn().mockReturnValue(null)
      mockRequest.params = { id: 1 }
      await deleteWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(404)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Resource does not exist' })
    })

    it('Wallet delete by unauthorised user', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.user = { id: 1 }
      walletData.owner = 2
      await deleteWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('Wallet delete with non-zero balance', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.user = { id: 2 }
      walletData.owner = 2
      walletData.balance = 2
      await deleteWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(403)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are forbidden from deleting non-zero balance wallet' })
    })

    it('Wallet delete by authorized user', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.user = { id: 1 }
      walletData.owner = 1
      walletData.balance = 0
      Transaction.find = jest.fn().mockReturnValue({ remove: jest.fn() })
      await deleteWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Wallet has been removed' })
    })
  })

  describe('Update Wallet', () => {
    const walletData = {}

    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      walletData.toJSON = jest.fn()
      walletData.remove = jest.fn()
      walletData.save = jest.fn()
      Wallet.findById = jest.fn().mockReturnValue(walletData)
      walletData.select = jest.fn().mockReturnValue(walletData)
    })

    it('Wallet not found', async () => {
      walletData.select = jest.fn().mockReturnValue(null)
      mockRequest.params = { id: 1 }
      await updateWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(404)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Resource does not exist' })
    })

    it('Wallet update by unauthorised user', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.user = { id: 1 }
      walletData.owner = 2
      await updateWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('Wallet update below available amount', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.body = { amount: -1 }
      mockRequest.user = { id: 1 }
      walletData.owner = 1
      walletData.balance = 0
      await updateWallet(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(403)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are Forbidden from this action' })
    })

    it('Wallet update by authorized user', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.body = { amount: -1 }
      mockRequest.user = { id: 1 }
      walletData.owner = 1
      walletData.balance = 10
      Transaction.prototype.save = jest.fn()
      await updateWallet(mockRequest, mockResponse, mockNext)
      expect(Transaction.prototype.save).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })
})
