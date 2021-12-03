import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { StudyGoalService } from './study-goal.service'
import { CreateStudyGoalDto } from './dto/create-study-goal.dto'
import { UpdateStudyGoalDto } from './dto/update-study-goal.dto'
import { PK } from '../shared/types'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserInfo } from '../shared/decoratos'
import { ValidationPipe } from '../shared/pipes'

@Controller('study-goals')
export class StudyGoalController {
  constructor(private readonly studyGoalService: StudyGoalService) {}

  /** 공부 목표 생성 */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(
    @UserInfo('id') userId: PK,
    @Body() createStudyGoalDto: CreateStudyGoalDto
  ) {
    return this.studyGoalService.create(userId, createStudyGoalDto)
  }

  /** 사용자 공부 목표 가져오기 */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@UserInfo('id') userId: PK) {
    return this.studyGoalService.findByUser(userId)
  }

  /** 공부 목표 하나 가져오기  */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: PK) {
    return this.studyGoalService.findOne(id)
  }

  /** 공부 목표 수정 */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: PK,
    @UserInfo('id') userId: PK,
    @Body() dto: UpdateStudyGoalDto
  ) {
    await this.studyGoalService.checkPermission(id, userId)
    return this.studyGoalService.update(id, dto)
  }

  /** 공부 목표 삭제 */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: PK, @UserInfo('id') userId: PK) {
    await this.studyGoalService.checkPermission(id, userId)
    return this.studyGoalService.delete(id)
  }
}
