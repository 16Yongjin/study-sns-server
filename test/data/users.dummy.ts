import * as faker from 'faker'
import { StudyGoal } from '../../src/study-goals/entities/study-goal.entity'
import { StudyTime } from '../../src/study-times/entities/study-time.entity'
import { Role } from '../../src/shared/enums'
import { User } from '../../src/users/entities/user.entity'
import { StudyRecord } from '../../src/study-records/entities/study-record.entity'
import { Comment } from '../../src/study-records/entities/comment.entity'
import { Like } from '../../src/study-records/entities/like.entity'

export const USER_PASSWORD = '123456'

export const createUserData = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  fullname: faker.name.findName(),
  password: USER_PASSWORD,
})

export const createUsers = () => [
  User.create({
    ...createUserData(),
    role: Role.ADMIN,
  }),
  User.create(createUserData()),
  User.create(createUserData()),
  User.create(createUserData()),
]

export const createStudyGoal = (user: User) =>
  StudyGoal.create({ user, name: faker.name.title() })

export const createStudyGoals = (user: User, n = 3) =>
  Array.from({ length: n }).map(() => createStudyGoal(user))

export const createStudyTime = (user: User, studyGoal: StudyGoal) =>
  StudyTime.create({
    user,
    studyGoal,
    duration: Math.round(Math.random() * 1000 * 60 * 60 * 5),
  })

export const createStudyRecord = (user: User, studyTime: StudyTime) =>
  StudyRecord.create({ user, studyTime, content: faker.lorem.lines(3) })

export const createComment = (user: User, studyRecord: StudyRecord) => {
  studyRecord.commentCount += 1
  return Comment.create({ user, studyRecord, content: faker.lorem.lines(3) })
}

export const createLike = (user: User, studyRecord: StudyRecord) => {
  studyRecord.likeCount += 1
  return Like.create({ user, studyRecord })
}
