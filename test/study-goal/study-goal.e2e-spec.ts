import 'dotenv/config'
import { Connection, Repository } from 'typeorm'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../../src/users/entities/user.entity'
import {
  createStudyGoals,
  createUsers,
  USER_PASSWORD,
} from '../data/users.dummy'
import { cleanFixtures, testConnection } from '../connection/typeorm'
import { UserAgent } from '../agent/user.agent'
import { StudyGoal } from '../../src/study-goals/entities/study-goal.entity'
import { StudyGoalModule } from '../../src/study-goals/study-goal.module'
import { AuthModule } from '../../src/auth/auth.module'

describe('Study Goal (e2e)', () => {
  let app: INestApplication
  let userRepository: Repository<User>
  let studyGoalRepository: Repository<StudyGoal>
  let users: User[]
  let studyGoals: StudyGoal[]
  let agent: UserAgent
  let connection: Connection

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(testConnection),
        AuthModule,
        StudyGoalModule,
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    connection = moduleFixture.get('Connection')
    userRepository = moduleFixture.get('UserRepository')
    studyGoalRepository = moduleFixture.get('StudyGoalRepository')
  })

  beforeEach(async () => {
    await cleanFixtures(connection)

    users = createUsers()
    await userRepository.save(users)
    studyGoals = createStudyGoals(users[0])
    await studyGoalRepository.save(studyGoals)
    agent = new UserAgent(app)

    // 로그인
    const loginData = {
      username: users[0].username,
      password: USER_PASSWORD,
    }
    await agent.login(loginData)
  })

  describe('POST /study-goals 공부 목표 생성', () => {
    it('공부 목표 생성', async () => {
      const goalData = { name: '목표1' }
      const { body } = await agent.createStudyGoal(goalData)

      expect(body).toEqual(expect.objectContaining(goalData))
    })

    it('빈 공부 목표 생성 불가', async () => {
      const goalData = { name: '' }
      await agent.createStudyGoal(goalData, {
        badRequest: true,
      })
    })
  })

  describe('GET /study-goals 공부 목표 가져오기', () => {
    it('공부 목표 가져오기', async () => {
      const { body } = await agent.getStudyGoals()

      expect(body).toHaveLength(studyGoals.length)
    })
  })

  describe('PATCH /study-goals/:id 공부 목표 수정', () => {
    it('공부 목표 수정', async () => {
      const goalData = { name: '목표 수정' }
      const { body } = await agent.updateStudyGoal(studyGoals[0].id, goalData)

      expect(body).toEqual(expect.objectContaining(goalData))
    })
  })

  describe('DELETE /study-goals/:id 공부 목표 삭제', () => {
    it('공부 목표 삭제', async () => {
      await agent.deleteStudyGoal(studyGoals[0].id)

      const { body } = await agent.getStudyGoals()
      expect(body).toHaveLength(Math.max(studyGoals.length - 1, 0))
    })

    it('다른 사람의 목표 삭제 불가', async () => {
      const loginData = {
        username: users[1].username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)
      await agent.deleteStudyGoal(studyGoals[0].id, {
        forbidden: true,
      })
    })
  })

  afterEach(async () => {
    await cleanFixtures(connection)
  })

  afterAll(async () => {
    await app.close()
  })
})
