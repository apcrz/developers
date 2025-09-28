import { Test, TestingModule } from '@nestjs/testing';
import { LevelService } from './level.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { CreateLevelDto } from './dto/create-level.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('LevelService', () => {
  let service: LevelService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<LevelService>(LevelService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a level', async () => {
      const dto: CreateLevelDto = { level: 'Beginner' };
      prisma.level.create.mockResolvedValue({
        id: 1,
        level: 'Beginner',
        createdAt: undefined,
        updatedAt: undefined,
      });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, level: 'Beginner' });
    });

    it('should throw if level already exists (P2002)', async () => {
      const dto: CreateLevelDto = { level: 'Beginner' };

      prisma.level.create.mockRejectedValue({
        code: 'P2002',
        name: 'PrismaClientKnownRequestError',
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated levels', async () => {
      const mockLevels = [
        {
          id: 1,
          level: 'Advanced',
          createdAt: undefined,
          updatedAt: undefined,
        },
      ];
      const mockCount = 1;

      prisma.$transaction.mockResolvedValue([mockLevels, mockCount]);

      const result = await service.findAll(undefined, 1);

      expect(result).toEqual({
        data: [{ id: 1, level: 'Advanced' }],
        totalCount: 1,
      });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.level.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 25,
      });
      expect(prisma.level.count).toHaveBeenCalledWith({ where: {} });
    });
  });

  describe('findOne', () => {
    it('should return a level by id', async () => {
      prisma.level.findUnique.mockResolvedValue({
        id: 1,
        level: 'Pro',
        createdAt: undefined,
        updatedAt: undefined,
      });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1, level: 'Pro' });
    });

    it('should throw if level not found', async () => {
      prisma.level.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a level', async () => {
      prisma.level.update.mockResolvedValue({
        id: 1,
        level: 'Master',
        createdAt: undefined,
        updatedAt: undefined,
      });

      const result = await service.update(1, { level: 'Master' });

      expect(result).toEqual({ id: 1, level: 'Master' });
    });

    it('should throw if level not found (P2025)', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '2.0.0',
      });

      prisma.level.update.mockRejectedValue(prismaError);

      await expect(service.update(999, { level: 'Fail' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a level', async () => {
      prisma.level.delete.mockResolvedValue({
        id: 1,
        level: 'Trash',
        createdAt: undefined,
        updatedAt: undefined,
      });

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw if level not found (P2025)', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '2.0.0',
      });

      prisma.level.delete.mockRejectedValue(prismaError);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
