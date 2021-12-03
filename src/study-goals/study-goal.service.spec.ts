import { Test, TestingModule } from '@nestjs/testing'
import { StudyGoalService } from './study-goal.service'

describe('StudyGoalService', () => {
  let service: StudyGoalService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyGoalService],
    }).compile()

    service = module.get<StudyGoalService>(StudyGoalService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
