import { Test, TestingModule } from '@nestjs/testing';
import { SysCacheService } from './sys-cache.service';

describe('SysCacheService', () => {
  let service: SysCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysCacheService],
    }).compile();

    service = module.get<SysCacheService>(SysCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
