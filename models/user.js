import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3
  },
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

export default User