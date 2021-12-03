import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { RolesGuard } from '../shared/guards/roles.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../shared/decoratos/roles.decorator'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { Role } from '../shared/enums'
import { ValidationPipe } from '../shared/pipes'
import { UpdateUserDto } from './dto'
import { UserGuard } from '../shared/guards'
import { PK } from '../shared/types'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, UserGuard)
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id)
  }

  @Post(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, UserGuard)
  updateTutor(@Param('id') id: PK, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto)
  }
}
