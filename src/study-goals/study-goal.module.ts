import { Module } from '@nestjs/common'
import { StudyGoalService } from './study-goal.service'
import { StudyGoalController } from './study-goal.controller'
import { UserModule } from '../users/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudyGoalRepository } from './study-goal.repo'

@Module({
  imports: [TypeOrmModule.forFeature([StudyGoalRepository]), UserModule],
  controllers: [StudyGoalController],
  providers: [StudyGoalService],
  exports: [TypeOrmModule, StudyGoalService],
})
export class StudyGoalModule {}
