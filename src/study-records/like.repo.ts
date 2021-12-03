import { AbstractRepository, EntityRepository } from 'typeorm'
import { PK } from '../shared/types'
import { Like } from './entities/like.entity'
import { User } from '../users/entities/user.entity'
import { StudyRecord } from './entities/study-record.entity'

@EntityRepository(Like)
export class LikeRepository extends AbstractRepository<Like> {
  /** 좋아요 달기 */
  create(user: User, studyRecord: StudyRecord) {
    const like = new Like()
    like.user = user
    like.studyRecord = studyRecord

    return this.repository.save(like)
  }

  /** 좋아요 모두 가져오기 */
  findAll(): Promise<Like[]> {
    return this.repository.find()
  }

  /** 좋아요 하나 가져오기 */
  findOne(id: PK, relations: string[] = []): Promise<Like> {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  /** 사용자가 공부 내용에 추가한 좋아요 가져오기 */
  findByStudyRecordAndUser(
    studyRecord: StudyRecord,
    user: User,
    relations: string[] = []
  ): Promise<Like> {
    return this.repository.findOne({
      where: { studyRecord, user },
      relations,
    })
  }

  /** 공부 내용에 달린 좋아요 모두 가져오기 */
  findByStudyRecord(
    studyRecord: StudyRecord,
    relations: string[] = []
  ): Promise<Like[]> {
    return this.repository.find({
      where: { studyRecord },
      relations,
    })
  }

  /** 사용자의 좋아요 가져오기 */
  findByUser(user: User, relations: string[] = []) {
    return this.repository.find({
      where: { user },
      relations,
    })
  }

  /** 좋아요 제거 */
  async delete(id: PK) {
    const deletedResult = await this.repository.delete(id)
    return !!deletedResult.affected
  }

  async checkUserLike(studyRecord: StudyRecord, user: User) {
    return this.repository.findOne({
      where: { studyRecord, user },
    })
  }
}
