import { Module } from '@nestjs/common'
import { StudyStatService } from './study-stat.service'
import { StudyStatController } from './study-stat.controller'
import { StudyStat } from './entities/study-stat.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([StudyStat])],
  controllers: [StudyStatController],
  providers: [StudyStatService],
  exports: [TypeOrmModule, StudyStatService],
})
export class StudyStatModule {}
