import { Test, TestingModule } from '@nestjs/testing'
import { StudyRecordController } from './study-record.controller'
import { StudyRecordService } from './study-record.service'

describe('StudyRecordController', () => {
  let controller: StudyRecordController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyRecordController],
      providers: [StudyRecordService],
    }).compile()

    controller = module.get<StudyRecordController>(StudyRecordController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
