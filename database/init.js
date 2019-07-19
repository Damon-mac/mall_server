import mongoose from 'mongoose'
import glob from 'glob'
import schedule from 'node-schedule'
import https from 'https'
import querystring from 'querystring'
import { resolve } from 'path'
import config from '../config'

const { dbUrl } = config

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

function getTodayOne() {
  const postData = querystring.stringify({
    'TransCode': '030111',
    'OpenId': '123456789'
  })
  const options = {
    hostname: 'api.hibai.cn',
    path: '/api/index/index',
    method: 'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length':Buffer.byteLength(postData)
    }
  }
  const req = https.request(options, res => {
    res.setEncoding('utf8');
    res.on("data", async chunk => {
      const data = JSON.parse(chunk)
      const One = mongoose.model('One')
      const has = await One.findOne({
        id: data.Body.id
      })
      if (!has) {
        const ones = new One(data.Body)
        ones.save()
      }
    })
    res.on("end",function(){
        console.log("### end ##")
    })
  }) 
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  })
  req.write(postData)
  req.end()
}
exports.initSchedule = async() => {
  schedule.scheduleJob('30 40 7 * * *',()=>{
    getTodayOne()
  });
}

exports.initOnes = async() => {
  docs.map(async item => {
    const has = await One.findOne({
      id: item.id
    })
    if (!has) {
      const ones = new One(item)
      ones.save()
    }
  })
}

exports.connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'product') {
      mongoose.set('debug', true)
    }
    mongoose.connect(dbUrl, {
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