import { Test, TestingModule } from '@nestjs/testing'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService
  let userData: User[]

  // beforeEach(async () => {
  //   userData = mockUserData()
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [mockUserRepository(userData), UserService],
  //   }).compile()

  //   service = module.get<UserService>(UserService)
  // })

  // it('should find all users', async () => {
  //   expect(await service.findAll()).toEqual(userData)
  // })

  // it('should find a user by username', async () => {
  //   const user = await service.findOneByUsername(userData[0].username)
  //   expect(user).toEqual(userData[0])
  // })
})
