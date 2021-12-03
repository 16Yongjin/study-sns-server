import 'dotenv/config'
import { Repository } from 'typeorm'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../../src/users/entities/user.entity'
import { AuthModule } from './../../src/auth/auth.module'
import { createUsers, USER_PASSWORD } from '../data/users.dummy'
import { testConnection } from '../connection/typeorm'
import { UserAgent } from '../agent/user.agent'

describe('UserController (e2e)', () => {
  let app: INestApplication
  let repository: Repository<User>
  let users: User[]
  let agent: UserAgent

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(testConnection),
        AuthModule,
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    repository = moduleFixture.get('UserRepository')
  })

  beforeEach(async () => {
    await repository.createQueryBuilder().delete().from(User).execute()
    users = createUsers()
    await repository.save(users)
    agent = new UserAgent(app)
  })

  describe('GET /users', () => {
    it('로그인 X, 유저 가져오기 불가', async () => {
      await agent.getUsers({ unauthorized: true })
    })

    it('User role은 모든 가져오기 불가', async () => {
      const loginData = {
        username: users[1].username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)

      await agent.getUsers({ forbidden: true })
    })

    it('Admin role은 모든 유저 가져오기 가능', async () => {
      const loginData = {
        username: users[0].username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)

      const { body } = await agent.getUsers()

      expect(body).toEqual(expect.any(Array))
    })
  })

  describe('POST /users/:id 유저 정보 수정', () => {
    it('유저 정보 수정', async () => {
      const user = users[1]
      const loginData = {
        username: user.username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)

      const userData = { fullname: 'doge' }

      const { body } = await agent.updateUser(user.id, userData)

      expect(body).toEqual(expect.objectContaining(userData))
    })
  })

  afterEach(async () => {
    await repository.createQueryBuilder().delete().from(User).execute()
  })

  afterAll(async () => {
    await app.close()
  })
})
