const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
    name: {
      type: String,
      maxlength: 128,
      minlength: 4,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  { timestamps: true },
)

// Hash the user password while create
// or password update before saving
userSchema.pre('save', async function save (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10)
    }

    return next()
  } catch (error) {
    return next(error)
  }
})

// Add a custom method to the schema methods
// A method to validate the hashed password
userSchema.method({
  async isPasswdMatch (password) {
    return bcrypt.compare(password, this.password)
  },
})

// Data Transformation for accessing the model object
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
    delete returnedObject.createdAt
    delete returnedObject.updatedAt
  },
})

// Register the schema
const User = mongoose.model('user', userSchema)

module.exports = User
