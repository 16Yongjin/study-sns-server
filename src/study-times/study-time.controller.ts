import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common'
import { StudyTimeService } from './study-time.service'
import { CreateStudyTimeDto } from './dto/create-study-time.dto'
import { UpdateStudyTimeDto } from './dto/update-study-time.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserInfo } from '../shared/decoratos'
import { PK } from '../shared/types'

@Controller('study-times')
export class StudyTimeController {
  constructor(private readonly studyTimeService: StudyTimeService) {}

  /** 공부 시간 생성 */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@UserInfo('id') userId: PK, @Body() dto: CreateStudyTimeDto) {
    return this.studyTimeService.create({ ...dto, userId })
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByUser(@UserInfo('id') userId: PK) {
    return this.studyTimeService.findByUser(userId)
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  findToday(@UserInfo('id') userId: PK) {
    return this.studyTimeService.findToday(userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: PK) {
    return this.studyTimeService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: PK,
    @UserInfo('id') userId: PK,
    @Body() dto: UpdateStudyTimeDto
  ) {
    await this.studyTimeService.checkPermission(id, userId)

    return this.studyTimeService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: PK, @UserInfo('id') userId: PK) {
    await this.studyTimeService.checkPermission(id, userId)

    return this.studyTimeService.delete(id)
  }
}
