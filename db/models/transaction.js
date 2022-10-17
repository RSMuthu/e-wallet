const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema(
  {
    wallet: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'wallet',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'user',
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
    },
    description: {
      type: String,
    },
    newBalance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

// Custom data manipulation before data save operation
transactionSchema.pre('save', async function save (next) {
  try {
    // based on the amount, set the type of operation
    this.type = (this.amount > 0) ? 'DEBIT' : 'CREDIT'
    this.amount = Math.abs(this.amount)
    return next()
  } catch (error) {
    return next(error)
  }
})

// Data Transformation for accessing the model object
transactionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.transactionDate = returnedObject.createdAt

    delete returnedObject.createdAt
    delete returnedObject.updatedAt
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Wallet = mongoose.model('transaction', transactionSchema)

module.exports = Wallet
