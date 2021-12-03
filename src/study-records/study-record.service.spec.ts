import { Test, TestingModule } from '@nestjs/testing'
import { StudyRecordService } from './study-record.service'

describe('StudyRecordService', () => {
  let service: StudyRecordService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyRecordService],
    }).compile()

    service = module.get<StudyRecordService>(StudyRecordService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
