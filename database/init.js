import mongoose from 'mongoose'
import glob from 'glob'
import schedule from 'node-schedule'
import https from 'https'
import querystring from 'querystring'
import { resolve } from 'path'
import config from '../config'

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.initAdmin = async() => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    user_name: 'zhu'
  })
  if (!user) {
    const user = new User({
      user_name: 'zhu',
      email: 'weidongzhu36@126.com',
      password: 'qweqwe',
      role: '超级管理员'
    })
    await user.save()
  }
}

exports.connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'product') {
      mongoose.set('debug', true)
    }
    mongoose.connect(config.dbUrl, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    const db = mongoose.connection

    db.once('open', () => {
      resolve()
      console.log('MongoDB connected successfully!')
    })
    db.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧, 快去修复吧少年')
      }
    })
    db.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧, 快去修复吧少年')
      }
    })
  })
}