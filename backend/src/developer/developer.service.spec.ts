import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperService } from './developer.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Gender, Prisma } from '@prisma/client';

describe('DeveloperService', () => {
  let service: DeveloperService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeveloperService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<DeveloperService>(DeveloperService);
    prisma = module.get<DeepMockProxy<PrismaService>>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateDeveloperDto = {
      name: 'John Doe',
      gender: Gender.MALE,
      levelId: 1,
      hobby: 'Coding',
      birthDate: "1982-08-25T00:00:00.000Z",
    };

    it('should create a developer', async () => {
      prisma.developer.create.mockResolvedValue({
        id: 1,
        ...dto,
        birthDate: new Date(dto.birthDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(dto);
      expect(result.name).toBe('John Doe');
      expect(result.gender).toBe(Gender.MALE);
      expect(prisma.developer.create).toHaveBeenCalled();
    });

    it('should throw if developer already exists (P2002)', async () => {
      prisma.developer.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint', {
          code: 'P2002',
          clientVersion: '3.0.0',
        })
      );

      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException(`Developer with name "${dto.name}" already exists.`)
      );
    });

    it('should throw if levelId does not exist (P2003)', async () => {
      prisma.developer.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Foreign key', {
          code: 'P2003',
          clientVersion: '3.0.0',
        })
      );

      await expect(service.create(dto)).rejects.toThrow(
        new NotFoundException(`Level with ID "${dto.levelId}" not found.`)
      );
    });

    it('should throw generic BadRequest on other errors', async () => {
      prisma.developer.create.mockRejectedValue(new Error('Unexpected'));

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated developers', async () => {
      const filters = { name: 'John' };
      prisma.$transaction.mockResolvedValue([
        [
          {
            id: 1,
            name: 'John',
            gender: Gender.MALE,
            birthDate: new Date(),
            hobby: 'Coding',
            createdAt: new Date(),
            updatedAt: new Date(),
            levelId: 1,
            level: { id: 1, level: 'Senior' },
          },
        ],
        1,
      ]);
      
      prisma.developer.count.mockResolvedValue(1);

      const result = await service.findAll(1, filters);
      expect(result.data.length).toBe(1);
      expect(result.totalCount).toBe(1);
    });

    it('should return empty if gender is invalid', async () => {
      const result = await service.findAll(1, { gender: 'INVALID' as Gender });
      expect(result.data).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should filter by level, name, hobby, and gender', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);
      prisma.developer.count.mockResolvedValue(0);

      const filters = {
        level: 'Senior',
        name: 'Jane',
        hobby: 'Chess',
        gender: Gender.FEMALE,
      };

      await service.findAll(2, filters);
      expect(prisma.developer.findMany).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      prisma.$transaction.mockRejectedValue(new Error('fail'));
      await expect(service.findAll(1, {})).rejects.toThrow(
        new BadRequestException('Error finding developers'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a developer by id', async () => {
      prisma.developer.findUnique.mockResolvedValue({
        id: 1,
        name: 'John',
        gender: Gender.MALE,
        birthDate: new Date(),
        hobby: 'Reading',
        createdAt: new Date(),
        updatedAt: new Date(),
        levelId: 1,
      });

      const result = await service.findOne(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('John');
    });

    it('should throw if developer not found', async () => {
      prisma.developer.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateDeveloperDto = {
      name: 'Jane Doe',
      hobby: 'Dancing',
      levelId: 2,
      gender: Gender.FEMALE,
      birthDate: "1990-01-01T00:00:00.000Z"
    };

    it('should update developer', async () => {
      prisma.developer.update.mockResolvedValue({
        id: 1,
        name: updateDto.name,
        hobby: updateDto.hobby,
        levelId: updateDto.levelId,
        gender: updateDto.gender,
        birthDate: new Date(updateDto.birthDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update(1, updateDto);
      expect(result.name).toBe('Jane Doe');
    });

    it('should throw if developer not found (P2025)', async () => {
      prisma.developer.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Not found', {
          code: 'P2025',
          clientVersion: '3.0.0',
        })
      );

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw if level not found (P2003)', async () => {
      prisma.developer.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('FK error', {
          code: 'P2003',
          clientVersion: '3.0.0',
        })
      );

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequest on other errors', async () => {
      prisma.developer.update.mockRejectedValue(new Error('Unexpected'));
      await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a developer', async () => {
      prisma.developer.delete.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        gender: Gender.MALE,
        levelId: 1,
        hobby: 'Coding',
        birthDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw if developer not found (P2025)', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '3.0.0',
      });

      prisma.developer.delete.mockRejectedValue(prismaError);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequest on other errors', async () => {
      prisma.developer.delete.mockRejectedValue(new Error('Other'));

      await expect(service.remove(999)).rejects.toThrow(BadRequestException);
    });
  });
});
