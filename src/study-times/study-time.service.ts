import { ForbiddenException, Injectable } from '@nestjs/common'
import { PK } from '../shared/types'
import { StudyGoalService } from '../study-goals/study-goal.service'
import { UserService } from '../users/user.service'
import { CreateStudyTimeDto } from './dto/create-study-time.dto'
import { UpdateStudyTimeDto } from './dto/update-study-time.dto'
import { StudyTimeNotFound } from './exceptions/not-found.exception'
import { StudyTimeRepository } from './study-time.repo'

@Injectable()
export class StudyTimeService {
  constructor(
    private userService: UserService,
    private studyGoalService: StudyGoalService,
    private studyTimeRepository: StudyTimeRepository
  ) {}

  /** 공부 시간 생성 */
  async create(dto: CreateStudyTimeDto) {
    const { userId, studyGoalId } = dto
    const [user, goal] = await Promise.all([
      this.userService.findOne(userId),
      this.studyGoalService.findOne(studyGoalId, ['user']),
    ])

    // 다른 사용자의 목표에 시간 추가 불가
    if (goal.user.id !== user.id) {
      throw new ForbiddenException()
    }

    return this.studyTimeRepository.create(user, goal)
  }

  /** 공부 목표 모두 가져오기 */
  findAll() {
    return this.studyTimeRepository.findAll()
  }

  /** 공부 목표 하나 가져오기 */
  async findOne(id: PK, relations: string[] = []) {
    const studyTime = await this.studyTimeRepository.findOneById(id, relations)
    if (!studyTime) {
      throw new StudyTimeNotFound(id)
    }
    return studyTime
  }

  /** 사용자 공부 목표 모두 가져오기 */
  async findByUser(userId: PK) {
    const user = await this.userService.findOne(userId)
    return this.studyTimeRepository.findByUser(user, ['studyGoal'])
  }

  /** 오늘의 사용자 공부 목표 모두 가져오기 */
  async findToday(userId: PK) {
    const user = await this.userService.findOne(userId)
    return this.studyTimeRepository.findToday(user, [
      'studyGoal',
      'studyRecord',
    ])
  }

  /** 공부 시간 업데이트 */
  async update(timeId: PK, dto: UpdateStudyTimeDto) {
    const { duration } = dto

    await this.studyTimeRepository.update(timeId, { duration })
    return this.findOne(timeId)
  }

  /** 공부 시간 제거(소프트하게) */
  async delete(timeId: PK) {
    return this.studyTimeRepository.delete(timeId)
  }

  /** 공부 시간 수정 권한 확인 */
  async checkPermission(id: PK, userId: PK) {
    const studyTime = await this.findOne(id, ['user'])
    if (studyTime.user.id !== userId) {
      throw new ForbiddenException()
    }
  }
}
