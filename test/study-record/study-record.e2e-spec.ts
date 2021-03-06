import 'dotenv/config'
import { Connection, Repository } from 'typeorm'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../../src/users/entities/user.entity'
import {
  createComment,
  createStudyGoals,
  createStudyRecord,
  createStudyTime,
  createUsers,
  USER_PASSWORD,
} from '../data/users.dummy'
import { cleanFixtures, testConnection } from '../connection/typeorm'
import { UserAgent } from '../agent/user.agent'
import { AuthModule } from '../../src/auth/auth.module'
import { StudyGoal } from '../../src/study-goals/entities/study-goal.entity'
import { StudyRecord } from '../../src/study-records/entities/study-record.entity'
import { StudyRecordModule } from '../../src/study-records/study-record.module'
import { StudyTime } from '../../src/study-times/entities/study-time.entity'
import { Comment } from '../../src/study-records/entities/comment.entity'

describe('Study Record (e2e)', () => {
  let app: INestApplication
  let userRepository: Repository<User>
  let studyGoalRepository: Repository<StudyGoal>
  let studyTimeRepository: Repository<StudyTime>
  let studyRecordRepository: Repository<StudyRecord>
  let commentRepository: Repository<Comment>
  let users: User[]
  let studyGoals: StudyGoal[]
  let studyTimes: StudyTime[]
  let studyRecords: StudyRecord[]
  let comments: Comment[]
  let agent: UserAgent
  let connection: Connection

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(testConnection),
        AuthModule,
        StudyRecordModule,
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    connection = moduleFixture.get('Connection')
    userRepository = moduleFixture.get('UserRepository')
    studyGoalRepository = moduleFixture.get('StudyGoalRepository')
    studyTimeRepository = moduleFixture.get('StudyTimeRepository')
    studyRecordRepository = moduleFixture.get('StudyRecordRepository')
    commentRepository = connection.getRepository('Comment')
  })

  beforeEach(async () => {
    await cleanFixtures(connection)

    users = createUsers()
    await userRepository.save(users)
    studyGoals = createStudyGoals(users[0])
    await studyGoalRepository.save(studyGoals)
    studyTimes = studyGoals.map((goal) => createStudyTime(users[0], goal))
    await studyTimeRepository.save(studyTimes)
    studyRecords = studyTimes.map((studyTime) =>
      createStudyRecord(studyTime.user, studyTime)
    )
    await studyRecordRepository.save(studyRecords)
    comments = studyRecords.map((record) => createComment(users[0], record))
    await commentRepository.save(comments)
    // ??????, ????????? ?????? ?????? ??????
    await studyRecordRepository.save(studyRecords)

    agent = new UserAgent(app)

    // ?????????
    const loginData = {
      username: users[0].username,
      password: USER_PASSWORD,
    }
    await agent.login(loginData)
  })

  describe('POST /study-records ?????? ?????? ??????', () => {
    it('?????? ?????? ??????', async () => {
      const timeData = { studyGoalId: studyGoals[0].id }
      const { body: studyTime } = await agent.createStudyTime(timeData)

      const studyRecordData = { content: 'hello' }
      const { body: studyRecord } = await agent.createStudyRecord({
        studyTimeId: studyTime.id,
        ...studyRecordData,
      })

      expect(studyRecord).toEqual(expect.objectContaining(studyRecordData))

      const { body } = await agent.getStudyRecords()
      expect(body).toHaveLength(studyRecords.length + 1) // ?????? ?????? ?????????
    })
  })

  describe('GET /study-records ?????? ?????? ????????????', () => {
    it('?????? ?????? ????????????', async () => {
      const { body } = await agent.getStudyRecords()

      expect(body).toHaveLength(studyRecords.length)
    })
  })

  describe('PATCH /study-records/:id ?????? ?????? ??????', () => {
    it('?????? ?????? ??????', async () => {
      const studyRecordData = { content: '[??????] hello' }
      const { body } = await agent.updateStudyRecord(
        studyRecords[0].id,
        studyRecordData
      )

      expect(body).toEqual(expect.objectContaining(studyRecordData))
    })
  })

  describe('DELETE /study-records/:id ?????? ?????? ??????', () => {
    it('?????? ?????? ??????', async () => {
      await agent.deleteStudyRecord(studyRecords[0].id)

      const { body } = await agent.getStudyRecords()
      expect(body).toHaveLength(Math.max(studyRecords.length - 1, 0))

      const { body: times } = await agent.getStudyTimes()
      expect(times).toHaveLength(studyTimes.length)
    })

    it('?????? ????????? ?????? ?????? ??????', async () => {
      const loginData = {
        username: users[1].username,
        password: USER_PASSWORD,
      }

      await agent.login(loginData)
      await agent.deleteStudyRecord(studyRecords[0].id, {
        forbidden: true,
      })
    })
  })
  // ========================
  //        ???       ???
  // ========================

  describe('POST /study-records/:id/comments ?????? ??????', () => {
    it('?????? ????????? ?????? ??????', async () => {
      const studyRecordId = studyRecords[0].id
      const commentData = { content: 'hello' }
      const { body: comment } = await agent.createComment(
        studyRecordId,
        commentData
      )

      expect(comment).toEqual(expect.objectContaining(commentData))

      // ?????? ?????? ++
      const { body: studyRecord } = await agent.getStudyRecord(studyRecordId)
      expect(studyRecord.commentCount).toEqual(studyRecords[0].commentCount + 1)

      const { body: comments } = await agent.getComments(studyRecordId)
      expect(comments).toHaveLength(studyRecords[0].commentCount + 1)
    })
  })

  describe('DELETE /study-records/:id/comments ?????? ?????????', () => {
    it('?????? ??????', async () => {
      const studyRecordId = studyRecords[0].id
      const { body: comment } = await agent.createComment(studyRecordId, {
        content: 'hello',
      })

      // ?????? ?????? ++
      const { body: studyRecord1 } = await agent.getStudyRecord(studyRecordId)
      expect(studyRecord1.commentCount).toEqual(
        studyRecords[0].commentCount + 1
      )
      const { body: comments } = await agent.getComments(studyRecordId)
      expect(comments).toHaveLength(studyRecords[0].commentCount + 1)

      await agent.deleteComment(studyRecordId, comment.id)

      // ?????? ?????? --
      const { body: studyRecord2 } = await agent.getStudyRecord(studyRecordId)
      expect(studyRecord2.commentCount).toEqual(studyRecords[0].commentCount)
    })
  })

  // ========================
  //        ???   ???   ???
  // ========================

  describe('POST /study-records/:id/likes ????????? ??????', () => {
    it('?????? ????????? ????????? ??????', async () => {
      const studyRecordId = studyRecords[0].id
      await agent.createLike(studyRecordId)

      // ????????? ?????? ++
      const { body: studyRecord } = await agent.getStudyRecord(studyRecordId)
      expect(studyRecord.likeCount).toEqual(studyRecords[0].likeCount + 1)
    })

    it('???????????? ????????? ??? ??? ??????', async () => {
      const studyRecordId = studyRecords[0].id
      await agent.createLike(studyRecordId)

      await agent.createLike(studyRecordId, {
        badRequest: true,
      })
    })
  })

  describe('DELETE /study-records/:id/likes ????????? ?????????', () => {
    it('????????? ??????', async () => {
      const studyRecordId = studyRecords[0].id
      await agent.createLike(studyRecordId)

      // ????????? ?????? ++
      const { body: studyRecord } = await agent.getStudyRecord(studyRecordId)
      expect(studyRecord.likeCount).toEqual(studyRecords[0].likeCount + 1)

      await agent.deleteLike(studyRecordId)

      // ????????? ?????? --
      const { body: studyRecord2 } = await agent.getStudyRecord(studyRecordId)
      expect(studyRecord2.likeCount).toEqual(studyRecords[0].likeCount)
    })

    it('????????? ?????? ?????? ????????? ????????? ?????? ?????? ', async () => {
      const studyRecordId = studyRecords[0].id
      await agent.deleteLike(studyRecordId, { notFound: true })
    })
  })

  afterEach(async () => {
    await cleanFixtures(connection)
  })

  afterAll(async () => {
    await app.close()
  })
})
