import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Role } from '../enums'

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const {
      user,
      params: { id },
    } = context.switchToHttp().getRequest()

    if (!user) return false
    if (user.role === Role.ADMIN) return true
    if (user.role === Role.USER && user.id.toString() === id) return true
    return false
  }
}
