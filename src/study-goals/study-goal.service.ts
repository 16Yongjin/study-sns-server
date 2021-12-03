import { ForbiddenException, Injectable } from '@nestjs/common'
import { PK } from '../shared/types'
import { UserService } from '../users/user.service'
import { CreateStudyGoalDto } from './dto/create-study-goal.dto'
import { UpdateStudyGoalDto } from './dto/update-study-goal.dto'
import { StudyGoalNotFound } from './exceptions/not-found.exception'
import { StudyGoalRepository } from './study-goal.repo'

@Injectable()
export class StudyGoalService {
  constructor(
    private userService: UserService,
    private studyGoalRepository: StudyGoalRepository
  ) {}

  async create(userId: PK, dto: CreateStudyGoalDto) {
    const { name } = dto
    const user = await this.userService.findOne(userId)

    return this.studyGoalRepository.create(user, name)
  }

  /** 공부 목표 모두 가져오기 */
  findAll() {
    return this.studyGoalRepository.findAll()
  }

  /** 공부 목표 하나 가져오기 */
  async findOne(id: PK, relations: string[] = []) {
    const studyGoal = await this.studyGoalRepository.findOne(id, relations)
    if (!studyGoal) {
      throw new StudyGoalNotFound(id)
    }

    return studyGoal
  }

  /** 사용자 공부 목표 모두 가져오기 */
  async findByUser(userId: PK) {
    const user = await this.userService.findOne(userId)
    return this.studyGoalRepository.findByUser(user)
  }

  /** 공부 목표 이름 수정 */
  async update(id: PK, dto: UpdateStudyGoalDto) {
    const { name } = dto
    const studyGoal = await this.findOne(id)

    studyGoal.name = name

    return this.studyGoalRepository.save(studyGoal)
  }

  /** 공부 목표 수정 가능 여부 확인하기 */
  async checkPermission(id: PK, userId: PK) {
    const studyGoal = await this.findOne(id, ['user'])
    // 공부 목표 주인만 수정 가능
    if (studyGoal.user.id !== userId) {
      throw new ForbiddenException()
    }
  }

  /** 공부 목표 제거(소프트하게) */
  async delete(id: PK) {
    await this.studyGoalRepository.delete(id)
  }
}
