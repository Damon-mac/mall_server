import mongoose from 'mongoose'
import { SuccessModel, ErrorModel } from '../model/resModel'

const Malls = mongoose.model('Mall')

export async function getList(pageNo, pageSize) {
  return Malls.find({})
}

export async function addGoods(goods) {
  return new Promise((resolve, reject) => {
    Malls.findOne({goodsId: goods.goodsId}, (err, doc) => {
      if (err) {
        reject(new ErrorModel('后端出错了'))
      }
      if (!doc) {
        const one = new Malls(goods)
        one.save(function(e, d) {
          if (e) {
            resolve(new ErrorModel('后端出错了'))
          }
          const {_id} = d
            resolve(new SuccessModel({_id}))
        })
      }
    })
  })
}