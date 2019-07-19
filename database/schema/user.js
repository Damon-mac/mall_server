import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  role: {
    type: String,
    default: '管理员'
  },
  user_name: {
    unique: true, // 是否唯一
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: String,
  hashed_password: String,
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.virtual('isLocked').get(function() { // 定义虚拟属性的getter
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

mongoose.model('User', UserSchema)

