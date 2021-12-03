import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from '../users/entities/user.entity'
import { UserService } from '../users/user.service'
import { mockUserData } from '../users/mocks/users.mock'
import * as argon2 from 'argon2'
import { mockUserRepository } from '../users/mocks/users.repository.mock'
import { ConfigModule } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { mockedJwtService } from '../utils/mocks/jwt.service'

jest.mock('argon2')

describe('AuthService', () => {
  let service: AuthService
  let userData: User[]

  beforeEach(async () => {
    userData = mockUserData()
    ;(argon2.hash as jest.Mock) = jest
      .fn()
      .mockImplementation((t) => Promise.resolve(t))
    ;(argon2.verify as jest.Mock) = jest
      .fn()
      .mockImplementation((a, b) => Promise.resolve(a === b))

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        mockUserRepository(userData),
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        UserService,
        AuthService,
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be validate user', async () => {
    const result = await service.validateUser('tester1', '123456')
    expect(result).toEqual(expect.objectContaining({ username: 'tester1' }))
    expect(result).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    )
  })
})
