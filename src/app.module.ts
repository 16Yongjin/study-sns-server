import 'dotenv/config'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudyTimeModule } from './study-times/study-time.module'
import { StudyGoalModule } from './study-goals/study-goal.module'
import { StudyRecordModule } from './study-records/study-record.module'
import { StudyStatModule } from './study-stats/study-stat.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    StudyTimeModule,
    StudyGoalModule,
    StudyRecordModule,
    StudyStatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
