import { Injectable } from '@nestjs/common'
import { User } from './entities/user.entity'
import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from './dto'
import { PK } from '../shared/types'
import { UserRepository } from './user.repo'
import { UserNotFound } from './exceptions/not-found.exception'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  create(dto: CreateUserDto) {
    return this.userRepository.create(dto)
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async findOne(id: PK): Promise<User> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      throw new UserNotFound(id)
    }

    return user
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneByUsername(username)

    if (!user) {
      throw new UserNotFound(username)
    }

    return user
  }

  checkUser(username: string, email: string): Promise<User | undefined> {
    return this.userRepository.checkUser(username, email)
  }

  async changePassword(id: PK, { password }: ChangePasswordDto) {
    const user = await this.findOne(id)

    await user.changePassword(password)

    return this.userRepository.save(user)
  }

  async updateUser(id: PK, dto: UpdateUserDto) {
    const user = await this.findOne(id)

    user.fullname = dto.fullname

    return this.userRepository.save(user)
  }
}
