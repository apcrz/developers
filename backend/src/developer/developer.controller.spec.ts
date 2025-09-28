import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

describe('DeveloperController', () => {
  let controller: DeveloperController;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeveloperController],
      providers: [
        DeveloperService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        }
      ],
    }).compile();

    controller = module.get<DeveloperController>(DeveloperController);
    prisma = module.get<DeepMockProxy<PrismaService>>(PrismaService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
