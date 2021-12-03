import { AbstractRepository, EntityRepository, MoreThan } from 'typeorm'
import { PK } from '../shared/types'
import { StudyTime } from './entities/study-time.entity'
import { User } from '../users/entities/user.entity'
import { StudyGoal } from '../study-goals/entities/study-goal.entity'
import dayjs from 'dayjs'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@EntityRepository(StudyTime)
export class StudyTimeRepository extends AbstractRepository<StudyTime> {
  create(user: User, studyGoal: StudyGoal) {
    const studyTime = new StudyTime()
    studyTime.user = user
    studyTime.studyGoal = studyGoal

    return this.repository.save(studyTime)
  }

  save(goal: StudyTime) {
    return this.repository.save(goal)
  }

  findAll(): Promise<StudyTime[]> {
    return this.repository.find()
  }

  findOneById(
    id: PK,
    relations: string[] = []
  ): Promise<StudyTime | undefined> {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  findByUser(user: User) {
    return this.repository.find({
      where: { user },
    })
  }

  findToday(user: User) {
    return this.repository.find({
      where: {
        user,
        createdAt: MoreThan(dayjs().startOf('d')),
      },
    })
  }

  async update(id: PK, data: QueryDeepPartialEntity<StudyTime>) {
    const updateResult = await this.repository.update(id, data)
    return !!updateResult.affected
  }

  async delete(id: PK) {
    const deletedResponse = await this.repository.softDelete(id)
    return !!deletedResponse.affected
  }
}
