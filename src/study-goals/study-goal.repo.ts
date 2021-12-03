import { AbstractRepository, EntityRepository } from 'typeorm'
import { PK } from '../shared/types'
import { StudyGoal } from './entities/study-goal.entity'
import { User } from '../users/entities/user.entity'

@EntityRepository(StudyGoal)
export class StudyGoalRepository extends AbstractRepository<StudyGoal> {
  create(user: User, name: string) {
    const goal = new StudyGoal()
    goal.user = user
    goal.name = name

    return this.repository.save(goal)
  }

  save(goal: StudyGoal) {
    return this.repository.save(goal)
  }

  findAll(): Promise<StudyGoal[]> {
    return this.repository.find()
  }

  findOne(id: PK, relations: string[] = []): Promise<StudyGoal | undefined> {
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

  async delete(id: PK) {
    const deletedResponse = await this.repository.softDelete(id)
    return !!deletedResponse.affected
  }
}
