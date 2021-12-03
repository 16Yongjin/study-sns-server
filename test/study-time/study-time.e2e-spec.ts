import 'dotenv/config'
import { Connection, Repository } from 'typeorm'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../../src/users/entities/user.entity'
import {
  createStudyGoals,
  createStudyTime,
  createUsers,
  USER_PASSWORD,
} from '../data/users.dummy'
import { cleanFixtures, testConnection } from '../connection/typeorm'
import { UserAgent } from '../agent/user.agent'
import { AuthModule } from '../../src/auth/auth.module'
import { StudyTime } from '../../src/study-times/entities/study-time.entity'
import { StudyTimeModule } from '../../src/study-times/study-time.module'
import { StudyGoal } from '../../src/study-goals/entities/study-goal.entity'

describe('Study Goal (e2e)', () => {
  let app: INestApplication
  let userRepository: Repository<User>
  let studyGoalRepository: Repository<StudyGoal>
  let studyTimeRepository: Repository<StudyTime>
  let users: User[]
  let studyGoals: StudyGoal[]
  let studyTimes: StudyTime[]
  let agent: UserAgent
  let connection: Connection

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(testConnection),
        AuthModule,
        StudyTimeModule,
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    connection = moduleFixture.get('Connection')
    userRepository = moduleFixture.get('UserRepository')
    studyGoalRepository = moduleFixture.get('StudyGoalRepository')
    studyTimeRepository = moduleFixture.get('StudyTimeRepository')
  })

  beforeEach(async () => {
    await cleanFixtures(connection)

    users = createUsers()
    await userRepository.save(users)
    studyGoals = createStudyGoals(users[0])
    await studyGoalRepository.save(studyGoals)
    studyTimes = studyGoals.map((goal) => createStudyTime(users[0], goal))
    await studyTimeRepository.save(studyTimes)

    agent = new UserAgent(app)

    // 로그인
    const loginData = {
      username: users[0].username,
      password: USER_PASSWORD,
    }
    await agent.login(loginData)
  })

  describe('POST /study-times 공부 시간 생성', () => {
    it('공부 시간 생성', async () => {
      const timeData = { studyGoalId: studyGoals[0].id }
      await agent.createStudyTime(timeData)

      const { body } = await agent.getStudyTimes()
      expect(body).toHaveLength(studyTimes.length + 1) // 공부 시간 추가됨
    })

    it('다른 사람의 목표에 공부 시간 생성 불가', async () => {
      const loginData = {
        username: users[1].username,
        password: USER_PASSWORD,
      }
      await agent.login(loginData)

      const timeData = { studyGoalId: studyGoals[0].id }
      await agent.createStudyTime(timeData, {
        forbidden: true,
      })
    })
  })

  describe('GET /study-times 공부 시간 가져오기', () => {
    it('공부 시간 가져오기', async () => {
      const { body } = await agent.getStudyTimes()

      expect(body).toHaveLength(studyTimes.length)
    })
  })

  describe('PATCH /study-times/:id 공부 시간 수정', () => {
    it('공부 시간 수정', async () => {
      const timeData = { duration: studyTimes[0].duration + 10 }
      const { body } = await agent.updateStudyTime(studyTimes[0].id, timeData)

      expect(body).toEqual(expect.objectContaining(timeData))
    })
  })

  describe('DELETE /study-times/:id 공부 시간 삭제', () => {
    it('공부 시간 삭제', async () => {
      await agent.deleteStudyTime(studyTimes[0].id)

      const { body } = await agent.getStudyTimes()
      expect(body).toHaveLength(Math.max(studyTimes.length - 1, 0))
    })

    it('다른 사람의 시간 삭제 불가', async () => {
      const loginData = {
        username: users[1].username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)
      await agent.deleteStudyTime(studyTimes[0].id, {
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
