import { Controller, Get } from '../decorator/router'
import { getOne, getAllOnes } from '../service/one'

@Controller('/api/one')
export default class OneRouter {
  @Get('detail/:id')
  async getOneDay(ctx, next) {
    const id = ctx.params.id
    const daily = await getOne(id)
    ctx.body = {
      code: '0000',
      data: daily,
      success: true
    }
  }

  @Get('all')
  async getAll(ctx, next) {
    const lists = await getAllOnes()
    if (lists) {
      ctx.body = {
        code: '0000',
        data: lists,
        success: true
      }
    }
  }
}