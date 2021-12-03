import { Module } from '@nestjs/common'
import { StudyRecordService } from './study-record.service'
import { StudyRecordController } from './study-record.controller'
import { UserModule } from '../users/user.module'
import { StudyTimeModule } from '../study-times/study-time.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudyRecordRepository } from './study-record.repo'
import { CommentRepository } from './comment.repo'
import { LikeRepository } from './like.repo'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyRecordRepository,
      CommentRepository,
      LikeRepository,
    ]),
    UserModule,
    StudyTimeModule,
  ],
  controllers: [StudyRecordController],
  providers: [StudyRecordService],
  exports: [TypeOrmModule, StudyRecordService],
})
export class StudyRecordModule {}
