import { Controller, Get, Post } from '../decorator/router'
import { getList, addGoods } from '../service/mall'
import { SuccessModel, ErrorModel } from '../model/resModel'

@Controller('/api/goods')
export default class OneRouter {
  @Get('list')
  async getSizeList(ctx, next) {
    const {pageNo = 0, pageSize = 10} = ctx.query
    const daily = await getList(pageNo, pageSize)
    ctx.body = new SuccessModel(daily)
  }

  @Post('addNew')
  async addNewGoods(ctx, next) {
    const body = ctx.request.body
    console.log(body);
    const res = await addGoods(body)
    ctx.body = res
  }
}