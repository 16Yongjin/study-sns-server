import { Test, TestingModule } from '@nestjs/testing';
import { StudyStatService } from './study-stat.service';

describe('StudyStatService', () => {
  let service: StudyStatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyStatService],
    }).compile();

    service = module.get<StudyStatService>(StudyStatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
