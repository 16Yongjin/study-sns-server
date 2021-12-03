import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { Request as Req } from 'express'
import { ChangePasswordDto, CreateUserDto } from '../users/dto'
import { ValidationPipe } from '../shared/pipes'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { UserInfo } from '../shared/decoratos'
import { UserAuth } from '../shared/interfaces'
import { Role } from '../shared/enums'
import { PK } from '../shared/types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Req) {
    return req.user
  }

  @Post('signup')
  async signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: Req) {
    return req.user
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('change-password')
  async changePassword(
    @UserInfo('id') userId: PK,
    @Body() dto: ChangePasswordDto
  ) {
    return this.authService.changePassword(userId, dto)
  }
}
