import { Test, TestingModule } from '@nestjs/testing'
import { StudyGoalController } from './study-goal.controller'
import { StudyGoalService } from './study-goal.service'

describe('StudyGoalController', () => {
  let controller: StudyGoalController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyGoalController],
      providers: [StudyGoalService],
    }).compile()

    controller = module.get<StudyGoalController>(StudyGoalController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
