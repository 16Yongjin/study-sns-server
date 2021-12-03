import { AbstractRepository, EntityRepository } from 'typeorm'
import { PK } from '../shared/types'
import { Comment } from './entities/comment.entity'
import { User } from '../users/entities/user.entity'
import { StudyRecord } from './entities/study-record.entity'

@EntityRepository(Comment)
export class CommentRepository extends AbstractRepository<Comment> {
  /** 댓글 달기 */
  create(user: User, studyRecord: StudyRecord, content: string) {
    const comment = new Comment()
    comment.user = user
    comment.studyRecord = studyRecord
    comment.content = content

    return this.repository.save(comment)
  }

  /** 댓글 모두 가져오기 */
  findAll(): Promise<Comment[]> {
    return this.repository.find()
  }

  /** 댓글 하나 가져오기 */
  findOne(id: PK, relations: string[] = []): Promise<Comment | undefined> {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  /** 공부 내용에 달린 댓글 모두 가져오기 */
  findByStudyRecord(
    studyRecord: StudyRecord,
    relations: string[] = []
  ): Promise<Comment[] | undefined> {
    return this.repository.find({
      where: { studyRecord },
      relations,
    })
  }

  /** 사용자의 댓글 가져오기 */
  findByUser(user: User) {
    return this.repository.find({
      where: { user },
    })
  }

  /** 댓글 제거 */
  async delete(id: PK) {
    const deletedResult = await this.repository.delete(id)
    return !!deletedResult.affected
  }
}
