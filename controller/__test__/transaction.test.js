const Transaction = require('../../db/models/transaction')
const Wallet = require('../../db/models/wallet')

const { getTransactions } = require('../transaction')

describe('Transaction controller', () => {
  const mockRequest = {}
  const mockResponse = {}
  const mockNext = jest.fn()

  describe(' All transaction list', () => {
    beforeEach(() => {
      mockResponse.status = jest.fn().mockReturnValue(mockResponse)
      mockResponse.json = jest.fn().mockReturnValue(mockResponse)
      mockResponse.cookie = jest.fn()
    })

    it('no wallet found', async () => {
      mockRequest.params = { id: 1 }
      Wallet.findOne = jest.fn().mockReturnValue(null)
      await getTransactions(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(404)
      expect(mockResponse.json).toBeCalledWith({ msg: 'Resource does not exist' })
    })

    it('wallet access unauthorized', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.user = { id: 1 }
      Wallet.findOne = jest.fn().mockReturnValue({
        ownerId: 123,
      })
      await getTransactions(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith({ msg: 'You are unauthorized to this resource' })
    })

    it('successfull listing', async () => {
      mockRequest.params = { id: 1 }
      mockRequest.user = { id: 1 }
      mockRequest.query = { skip: 1, limit: 1 }
      Wallet.findOne = jest.fn().mockReturnValue({
        ownerId: 1,
      })
      const transactionData = {
        toJSON: jest.fn(),
      }
      Transaction.find = jest.fn().mockReturnValue(transactionData)
      transactionData.sort = jest.fn().mockReturnValue(transactionData)
      transactionData.skip = jest.fn().mockReturnValue(transactionData)
      transactionData.limit = jest.fn().mockReturnValue(transactionData)
      transactionData.populate = jest.fn().mockReturnValue(transactionData)

      await getTransactions(mockRequest, mockResponse, mockNext)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
    })
  })
})
