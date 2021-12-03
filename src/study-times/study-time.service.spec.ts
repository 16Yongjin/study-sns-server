import { Test, TestingModule } from '@nestjs/testing'
import { StudyTimeService } from './study-time.service'

describe('StudyTimeService', () => {
  let service: StudyTimeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyTimeService],
    }).compile()

    service = module.get<StudyTimeService>(StudyTimeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
