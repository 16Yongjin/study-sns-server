import { Module } from '@nestjs/common'
import { StudyTimeService } from './study-time.service'
import { StudyTimeController } from './study-time.controller'
import { StudyGoalModule } from '../study-goals/study-goal.module'
import { UserModule } from '../users/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudyTimeRepository } from './study-time.repo'

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyTimeRepository]),
    StudyGoalModule,
    UserModule,
  ],
  controllers: [StudyTimeController],
  providers: [StudyTimeService],
  exports: [TypeOrmModule, StudyTimeService],
})
export class StudyTimeModule {}
