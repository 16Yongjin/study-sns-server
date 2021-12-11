import { ForbiddenException, Injectable } from '@nestjs/common'
import { PK } from '../shared/types'
import { StudyTimeService } from '../study-times/study-time.service'
import { UserService } from '../users/user.service'
import { CommentRepository } from './comment.repo'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CreateLikeDto } from './dto/create-like.dto'
import { CreateStudyRecordDto } from './dto/create-study-record.dto'
import { UpdateStudyRecordDto } from './dto/update-study-record.dto'
import {
  CommentNotFound,
  LikeNotFound,
  StudyRecordNotFound,
} from './exceptions/not-found.exception'
import { LikeRepository } from './like.repo'
import { StudyRecordRepository } from './study-record.repo'

@Injectable()
export class StudyRecordService {
  constructor(
    private userService: UserService,
    private studyTimeService: StudyTimeService,
    private studyRecordRepository: StudyRecordRepository,
    private commentRepository: CommentRepository,
    private likeRepository: LikeRepository
  ) {}

  /** 공부 기록 생성 */
  async create(dto: CreateStudyRecordDto) {
    const { userId, studyTimeId, content } = dto
    const [user, studyTime] = await Promise.all([
      this.userService.findOne(userId),
      this.studyTimeService.findOne(studyTimeId, ['studyGoal']),
    ])

    return this.studyRecordRepository.create(user, studyTime, content)
  }

  /** 공부 기록 모두 가져오기 */
  findAll() {
    return this.studyRecordRepository.findAll()
  }

  /** 공개 공부 기록 목록 가져오기 */
  findPublic(userId?: PK) {
    if (userId) return this.studyRecordRepository.findPublicWithUserLike(userId)

    return this.studyRecordRepository.findPublic([
      'user',
      'studyTime',
      'studyTime.studyGoal',
    ])
  }

  async findByUser(userId: PK) {
    const user = await this.userService.findOne(userId)
    return this.studyRecordRepository.findByUser(user, [
      'studyTime',
      'studyTime.studyGoal',
    ])
  }

  /** 공부 기록 하나 가져오기 */
  async findOne(id: PK, relations: string[] = []) {
    const studyRecord = await this.studyRecordRepository.findOne(id, relations)
    if (!studyRecord) {
      throw new StudyRecordNotFound(id)
    }
    return studyRecord
  }

  async findOneWithUserLike(id: PK, userId: PK) {
    return this.studyRecordRepository.findOneWithUserLike(id, userId)
  }

  /** 공부 내용 업데이트 */
  async update(id: PK, dto: UpdateStudyRecordDto) {
    const { content } = dto
    const studyRecord = await this.findOne(id)

    studyRecord.content = content

    return this.studyRecordRepository.save(studyRecord)
  }

  delete(id: PK) {
    return this.studyRecordRepository.delete(id)
  }

  async checkPermission(id: PK, userId: PK) {
    const studyRecord = await this.findOne(id, ['user'])
    if (studyRecord.user.id !== userId) {
      throw new ForbiddenException()
    }
  }

  // ===========================
  //       댓         글
  // ===========================

  /** 댓글 추가 */
  async addComment(id: PK, dto: CreateCommentDto) {
    const { userId, content } = dto
    const [user, studyRecord] = await Promise.all([
      this.userService.findOne(userId),
      this.findOne(id),
    ])

    // 댓글 생성
    const comment = await this.commentRepository.create(
      user,
      studyRecord,
      content
    )
    // 댓글 개수 증가
    studyRecord.commentCount += 1

    await this.studyRecordRepository.save(studyRecord)
    return comment
  }

  /** 댓글 가져오기 */
  async findComment(commentId: PK, relations: string[] = []) {
    const comment = await this.commentRepository.findOne(commentId, relations)
    if (!comment) {
      throw new CommentNotFound(commentId)
    }
    return comment
  }

  /** 공부 내용에 달린 댓글 목록 가져오기 */
  async findComments(id: PK) {
    const studyRecord = await this.findOne(id)
    return this.commentRepository.findByStudyRecord(studyRecord, ['user'])
  }

  /** 댓글 삭제 */
  async deleteComment(id: PK, commentId: PK) {
    const studyRecord = await this.findOne(id)

    // 댓글 제거
    await this.commentRepository.delete(commentId)

    // 댓글 개수 감소
    studyRecord.commentCount -= 1

    return this.studyRecordRepository.save(studyRecord)
  }

  async checkCommentPermission(commentId: PK, userId: PK) {
    const comment = await this.findComment(commentId, ['user'])
    if (comment.user.id !== userId) {
      throw new ForbiddenException()
    }
  }

  // ===========================
  //       좋     아    요
  // ===========================

  /** 좋아요 추가 */
  async addLike(id: PK, dto: CreateLikeDto) {
    const { userId } = dto
    const [user, studyRecord] = await Promise.all([
      this.userService.findOne(userId),
      this.findOne(id),
    ])

    // 좋아요 생성
    await this.likeRepository.create(user, studyRecord)
    // 좋아요 개수 증가
    studyRecord.likeCount += 1

    return this.studyRecordRepository.save(studyRecord)
  }

  /** 좋아요 가져오기 */
  async findLike(likeId: PK, relations: string[] = []) {
    const like = await this.likeRepository.findOne(likeId, relations)
    if (!like) {
      throw new LikeNotFound(likeId)
    }
    return like
  }

  /** 좋아요 삭제 */
  async deleteLike(id: PK, likeId: PK) {
    const studyRecord = await this.findOne(id)

    // 좋아요 제거
    await this.likeRepository.delete(likeId)

    // 좋아요 개수 감소
    studyRecord.likeCount -= 1

    return this.studyRecordRepository.save(studyRecord)
  }

  /** 사용자가 공부 내용에 좋아요 표시했는지 확인 */
  async checkUserLike(id: PK, userId: PK) {
    const [studyRecord, user] = await Promise.all([
      this.findOne(id),
      this.userService.findOne(userId),
    ])
    return this.likeRepository.checkUserLike(studyRecord, user)
  }
}
