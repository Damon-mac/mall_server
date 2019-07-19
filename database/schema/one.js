import mongoose from 'mongoose'

const OneSchema = mongoose.Schema({
  id: Number,
  vol: String,
  img_url: String,
  img_author: String,
  img_kind: String,
  date: Date,
  url: String,
  word: String,
  word_from: String,
  word_id: Number
})

mongoose.model('One', OneSchema)