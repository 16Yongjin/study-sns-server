import { AbstractRepository, EntityRepository } from 'typeorm'
import { PK } from '../shared/types'
import { StudyRecord } from './entities/study-record.entity'
import { User } from '../users/entities/user.entity'
import { StudyTime } from '../study-times/entities/study-time.entity'

@EntityRepository(StudyRecord)
export class StudyRecordRepository extends AbstractRepository<StudyRecord> {
  /** 공부 기록 생성 */
  create(user: User, studyTime: StudyTime, content: string) {
    const record = new StudyRecord()
    record.user = user
    record.studyTime = studyTime
    record.content = content

    return this.repository.save(record)
  }

  /** 공부 기록 저장 */
  save(goal: StudyRecord) {
    return this.repository.save(goal)
  }

  /** 공부 기록 하나 가져오기 */
  findOne(id: PK, relations: string[] = []): Promise<StudyRecord | undefined> {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  /** 공부 기록 모두 가져오기 */
  findAll(relations: string[] = []): Promise<StudyRecord[]> {
    return this.repository.find({ relations })
  }

  /** 사용자의 공부 기록 가져오기 */
  findByUser(user: User, relations: string[] = []) {
    return this.repository.find({
      where: { user },
      relations,
    })
  }

  /** 공개된 공부 기록 가져오기 */
  findPublic(relations: string[] = []) {
    return this.repository.find({
      where: { public: true },
      relations,
    })
  }

  /** 공부 기록 제거 */
  async delete(id: PK) {
    const deletedResponse = await this.repository.softDelete(id)
    return !!deletedResponse.affected
  }
}
