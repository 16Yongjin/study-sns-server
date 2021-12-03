import { Test, TestingModule } from '@nestjs/testing';
import { StudyStatController } from './study-stat.controller';
import { StudyStatService } from './study-stat.service';

describe('StudyStatController', () => {
  let controller: StudyStatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyStatController],
      providers: [StudyStatService],
    }).compile();

    controller = module.get<StudyStatController>(StudyStatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
