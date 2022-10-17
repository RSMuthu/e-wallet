const mongoose = require('mongoose')
const Schema = mongoose.Schema

const walletSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'user',
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
)

// Data Transformation for accessing the model object
walletSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Wallet = mongoose.model('wallet', walletSchema)

module.exports = Wallet
