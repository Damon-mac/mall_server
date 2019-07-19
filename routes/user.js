import { Controller, Get } from '../decorator/router'
import { getAllUsers } from '../service/user'

@Controller('/api/user')
export default class UserRouter {
  @Get('list')
  async getAll(ctx, next) {
    const allUsers = await getAllUsers()
    console.log(allUsers)
    ctx.body = {
      code: '0000',
      data: allUsers,
      success: true
    }
  }
}