import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { StudyRecordService } from './study-record.service'
import { CreateStudyRecordDto } from './dto/create-study-record.dto'
import { UpdateStudyRecordDto } from './dto/update-study-record.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserInfo } from '../shared/decoratos'
import { ValidationPipe } from '../shared/pipes'
import { PK } from '../shared/types'
import { CreateCommentDto } from './dto/create-comment.dto'
import { AlreadyLikedException } from './exceptions/bad-request.exception'
import { LikeNotFound } from './exceptions/not-found.exception'

@Controller('study-records')
export class StudyRecordController {
  constructor(private readonly studyRecordService: StudyRecordService) {}

  /** 공부 내용 생성 */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @UserInfo('id') userId: PK,
    @Body(new ValidationPipe()) dto: CreateStudyRecordDto
  ) {
    return this.studyRecordService.create({ ...dto, userId })
  }

  @Get()
  findPublic() {
    return this.studyRecordService.findPublic()
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findByUser(@UserInfo('id') userId: PK) {
    return this.studyRecordService.findByUser(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: PK) {
    return this.studyRecordService.findOne(id, [
      'user',
      'studyTime',
      'studyTime.studyGoal',
    ])
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @UserInfo('id') userId: PK,
    @Body() dto: UpdateStudyRecordDto
  ) {
    await this.studyRecordService.checkPermission(id, userId)
    return this.studyRecordService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @UserInfo('id') userId: PK) {
    await this.studyRecordService.checkPermission(id, userId)
    return this.studyRecordService.delete(id)
  }

  // ========================
  //        댓       글
  // ========================

  /** 댓글 달기 */
  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Param('id') id: string,
    @UserInfo('id') userId: PK,
    @Body(new ValidationPipe()) dto: CreateCommentDto
  ) {
    return this.studyRecordService.addComment(id, { ...dto, userId })
  }

  /** 댓글 목록 가져오기 */
  @Get(':id/comments')
  findComments(@Param('id') id: PK) {
    return this.studyRecordService.findComments(id)
  }

  /** 댓글 제거 */
  @Delete(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @UserInfo('id') userId: PK
  ) {
    await this.studyRecordService.checkCommentPermission(commentId, userId)
    return this.studyRecordService.deleteComment(id, commentId)
  }

  // ========================
  //        좋   아   요
  // ========================

  /** 좋아요 달기 */
  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  async addLike(@Param('id') id: string, @UserInfo('id') userId: PK) {
    const liked = await this.studyRecordService.checkUserLike(id, userId)
    if (liked) {
      throw new AlreadyLikedException()
    }

    return this.studyRecordService.addLike(id, { userId })
  }

  /** 좋아요 제거 */
  @Delete(':id/likes')
  @UseGuards(JwtAuthGuard)
  async deleteLike(@Param('id') id: string, @UserInfo('id') userId: PK) {
    const like = await this.studyRecordService.checkUserLike(id, userId)
    if (!like) {
      throw new LikeNotFound(id)
    }

    return this.studyRecordService.deleteLike(id, like.id)
  }
}
