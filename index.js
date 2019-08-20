import Koa from 'koa'
import R from 'ramda'
import config from './config'
import { join } from 'path'
import { connect, initSchemas, initAdmin } from './database/init'

const MIDDLEWARES = ['general', 'router']

const useMiddlewares = (app) => {
  R.map(
    R.compose(    // 将多个函数合并成一个函数，从右到左执行
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => join(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async() => {
  await connect()
  initSchemas()
  await initAdmin()
  const app = new Koa()
  await useMiddlewares(app)
  app.listen(config.port, () => {
    console.log(
      process.env.NODE_ENV === 'development'
        ? `Open http://localhost:${config.port}`
        : `App listening on port ${config.port}`
    )
  })
})()