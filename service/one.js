import mongoose from 'mongoose'

const Ones = mongoose.model('One')

export async function getOne(id) {
  return Ones.find({id})
}

export async function getAllOnes() {
  return Ones.find({})
}