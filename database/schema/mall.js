import mongoose from 'mongoose'

const MallSchema = mongoose.Schema({
  goodsId: Number,
  title: String,
  tenDesc: String,
  subTitle: String,
  shortTitle: String,
  mainPic: String,
  mainPics: Array,
  platformPrice: Number,
  marketPrice: Number,
  status: {
    type: Number,
    default: 1
  }
})

mongoose.model('Mall', MallSchema)