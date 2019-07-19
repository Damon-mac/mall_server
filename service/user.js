import mongoose from 'mongoose'

const User = mongoose.model('User')

export async function getAllUsers() {
  return await User.find({})
}