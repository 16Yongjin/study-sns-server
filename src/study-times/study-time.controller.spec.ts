import { Test, TestingModule } from '@nestjs/testing'
import { StudyTimeController } from './study-time.controller'
import { StudyTimeService } from './study-time.service'

describe('StudyTimeController', () => {
  let controller: StudyTimeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyTimeController],
      providers: [StudyTimeService],
    }).compile()

    controller = module.get<StudyTimeController>(StudyTimeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
