import 'dotenv/config'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'
import { AuthModule } from './../../src/auth/auth.module'
import { User } from '../../src/users/entities/user.entity'
import { createUsers, createUserData, USER_PASSWORD } from '../data/users.dummy'
import { cleanFixtures, testConnection } from '../connection/typeorm'
import { UserAgent } from '../agent/user.agent'

describe('AuthModule /auth (e2e)', () => {
  let app: INestApplication
  let userRepository: Repository<User>
  let users: User[]
  let agent: UserAgent
  let connection: Connection

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testConnection), AuthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    connection = moduleFixture.get('Connection')
    userRepository = moduleFixture.get('UserRepository')
  })

  beforeEach(async () => {
    await cleanFixtures(connection)

    users = createUsers()

    await userRepository.save(users)

    agent = new UserAgent(app)
  })

  describe('POST /signup 사용자 회원가입', () => {
    it('회원가입 성공', async () => {
      const signupData = createUserData()

      const { body } = await agent.signup(signupData)

      // 기본 정보 + 토큰 확인
      expect(body).toEqual(
        expect.objectContaining({
          username: signupData.username,
          email: signupData.email,
          token: expect.any(String),
        })
      )
      // 비밀번호 제거
      expect(body.password).not.toBeDefined()
    })

    it('중복 이름이 있는 경우 회원가입 실패', async () => {
      const signupData = {
        ...createUserData(),
        username: users[0].username,
      }

      const { body } = await agent.signup(signupData, { badRequest: true })

      expect(body.errors).toBeDefined()
    })

    it('username이 없는 경우 회원가입 실패', async () => {
      const signupData = createUserData()
      delete signupData.username

      const { body } = await agent.signup(signupData, { badRequest: true })

      expect(body.errors.username).toBeDefined()
    })

    it('비밀번호는 6글자 이상', async () => {
      const signupData = createUserData()
      signupData.password = '1'.repeat(5)

      const { body } = await agent.signup(signupData, { badRequest: true })

      expect(body.errors.password).toBeDefined()
    })
  })

  describe('POST /login 사용자 로그인', () => {
    it('로그인 성공', async () => {
      const loginData = {
        username: users[0].username,
        password: USER_PASSWORD,
      }

      const { body } = await agent.login(loginData)

      // 기본 정보 + 토큰 확인
      expect(body).toEqual(
        expect.objectContaining({
          username: loginData.username,
          token: expect.any(String),
        })
      )

      expect(body.password).not.toBeDefined()
    })

    it('로그인 실패: 잘못된 비밀번호', async () => {
      const loginData = {
        username: users[0].username,
        password: '12345',
      }

      await agent.login(loginData, { unauthorized: true })
    })
  })

  describe('GET /me 로그인 사용자 정보 확인', () => {
    it('로그인 정보 확인 성공', async () => {
      const loginData = {
        username: users[0].username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)
      const { body } = await agent.me()

      expect(body).toEqual(
        expect.objectContaining({
          username: loginData.username,
        })
      )
    })

    it('로그인 정보 확인 실패: 잘못된 토큰', async () => {
      await agent.me({ unauthorized: true })
    })
  })

  describe('POST /auth/change-password 유저 비밀번호 변경', () => {
    it('유저 비밀번호 변경', async () => {
      const loginData = {
        username: users[1].username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)

      const changePasswordData = {
        username: users[1].username,
        password: '654321',
      }

      const { body } = await agent.changePassword(changePasswordData)

      expect(body.password).not.toBeDefined()

      await agent.login(changePasswordData)
    })
  })

  afterEach(async () => {
    await cleanFixtures(connection)
  })

  afterAll(async () => {
    await app.close()
  })
})
