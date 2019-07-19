import KoaRouter from 'koa-router'
import glob from 'glob'
import R from 'ramda'
import { resolve } from 'path'

const pathPrefix = Symbol('pathPrefix')
const routeMap = []

const resolvePath = R.unless( // 统一路径格式以'/'开头
  R.startsWith('/'),  // R.unless用法, 符合第一个参数规则直接返回, 不符合执行第二个参数的方法
  R.curryN(2, R.concat)('/')
)
const changeToArr = R.unless( // 把不是数组格式的转换为数组
  R.is(Array),
  R.of  // 不管是不是数组, 外面都包一层数组
)

export class Route {
  constructor(app, routesPath){
    this.app = app
    this.router = new KoaRouter()
    this.routesPath = routesPath
  }

  init() {
    const {app, router, routesPath} = this
    glob.sync(resolve(routesPath, './*.js')).forEach(require) // 引入所有的路由文件
    R.forEach(  // 遍历路由数组所有路由, 注册路由
      ({ target, method, path, callback }) => {
        const prefix = resolvePath(target[pathPrefix])
        router[method](prefix + path, ...callback)
      }
    )(routeMap)

    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

export const Controller = path => target => (target.prototype[pathPrefix] = path) // 装饰类的装饰器

export const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path: resolvePath(path),
    callback: changeToArr(target[key])
  })
  return descriptor
}
export const Get = setRouter('get') // 初始化各个请求方法的装饰器函数
export const Post = setRouter('post')
export const Put = setRouter('put')
export const Delete = setRouter('delete')

const decorate = (args, middleware) => {  // 把各个中间件放到被修饰的函数前面来执行
  let [target, key, descriptor] = args
  target[key] = changeToArr(target[key])
  target[key].unshift(middleware)
  return descriptor
}
const convert = middleware => (...args) => decorate(args, middleware)

export const Auth = () => convert(async (ctx, next) => {  // 判断登录信息是否失效
  if (!ctx.session.user) {
    return (
      ctx.body = {
        errCode: 401,
        success: false,
        errMsg: '登陆信息已失效, 请重新登录'
      }
    )
  }
  await next()
})

export const Admin = roleExpected => convert(async (ctx, next) => {
  const { role } = ctx.session.user
  if (!role || role !== roleExpected) {
    return (
      ctx.body = {
        success: false,
        errCode: 403,
        errMsg: '你没有权限, 来错地方啦!'
      }
    )
  }
})