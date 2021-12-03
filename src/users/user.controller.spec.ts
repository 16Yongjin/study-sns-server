import { Test, TestingModule } from '@nestjs/testing'
import { User } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UsersController', () => {
  let controller: UserController
  let userData: User[]

  // beforeEach(async () => {
  //   userData = mockUserData()

  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [mockUserRepository(userData), UserService],
  //     controllers: [UsersController],
  //   }).compile()

  //   controller = module.get<UsersController>(UsersController)
  // })

  // it('should be defined', () => {
  //   expect(controller).toBeDefined()
  // })

  // it('should return all users', async () => {
  //   const users = await controller.findAll()
  //   expect(users).toEqual(userData)
  // })

  // it('should return a user', () => {
  //   expect(controller.findOne(1)).toBe(`user with 1`)
  // })
})
