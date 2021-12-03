import * as argon2 from 'argon2'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/user.service'
import { ChangePasswordDto, CreateUserDto } from '../users/dto'
import { User } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username)
    if (!user) {
      throw new UnauthorizedException({
        message: 'Username not exists',
        errors: { username: 'username not exists' },
      })
    }

    const isValid = await argon2.verify(user.password, pass)

    if (!isValid) {
      throw new UnauthorizedException({
        message: 'Wrong password',
        errors: { password: 'wrong password' },
      })
    }

    return this.buildUserRO(user)
  }

  async signup(dto: CreateUserDto) {
    const user = await this.userService.checkUser(dto.username, dto.email)

    if (user) {
      const message = 'Bad signup request'
      const errors = {
        username:
          user.username === dto.username
            ? 'Username is already in use.'
            : undefined,
        email: user.email === dto.email ? 'Email is already in use' : undefined,
      }
      throw new BadRequestException({ message, errors })
    }

    const savedUser = await this.userService.create(dto)

    return this.buildUserRO(savedUser)
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.userService.changePassword(dto)
    return this.buildUserRO(user)
  }

  public generateJWT(user: User) {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      exp: exp.getTime() / 1000,
    })
  }

  private buildUserRO(user: User) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateJWT(user),
      role: user.role,
    }

    return userRO
  }
}
