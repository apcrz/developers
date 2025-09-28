import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ResponseLevelDto } from './dto/response-level.dto';
import { ResponseListLevelDto } from './dto/response-list-level.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createLevelDto: CreateLevelDto): Promise<ResponseLevelDto> {
    try {
      const level = await this.prisma.level.create({
        data: {
          level: createLevelDto.level,
        },
      });
      const newLevel = plainToInstance(ResponseLevelDto, level, { excludeExtraneousValues: true });
      return newLevel;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`Level "${createLevelDto.level}" already exists.`);
        }
      }
      throw new BadRequestException(`Error creating level: ${error.message}`);
    }
  }
  
  async findAll(level?: string, page: number = 1): Promise<{ data: ResponseListLevelDto[], totalCount: number}> {
    const where: Prisma.LevelWhereInput = {};

    if (typeof level === 'string' && level.trim() !== '') {
      where.level = {
        contains: level,
      };
    }

    const [levels, totalCount] = await this.prisma.$transaction([
      this.prisma.level.findMany({
        where,
        skip: (page - 1) * (process.env.RECORDS_PER_PAGE ? parseInt(process.env.RECORDS_PER_PAGE, 10) : 25),
        take: process.env.RECORDS_PER_PAGE ? parseInt(process.env.RECORDS_PER_PAGE, 10) : 25,
      }),
      this.prisma.level.count({ where }),
    ]);

    const data = plainToInstance(ResponseLevelDto, levels, { excludeExtraneousValues: true });

    return { data, totalCount };
  }

  async findOne(id: number): Promise<ResponseLevelDto> {
    const level = await this.prisma.level.findUnique({
      where: { id },
    });

    if (!level) {
      throw new NotFoundException(`Level with id ${id} not found`);
    }

    return plainToInstance(ResponseLevelDto, level, { excludeExtraneousValues: true });
  }

  async update(id: number, updateLevelDto: UpdateLevelDto): Promise<ResponseLevelDto> {
    try {

      const level = await this.prisma.level.update({
        where: { id },
        data: updateLevelDto,
      });
      return plainToInstance(ResponseLevelDto, level, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Level with id ${id} not found`);
        }
      }
      throw new BadRequestException(`Error updating level: ${error.message}`);
    }

  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.level.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Level with id ${id} not found`);
        }

        if (error.code === 'P2003') {
          throw new BadRequestException(`Cannot delete level with id ${id} because it is referenced by other records.`);
        }
      }
      throw new BadRequestException(`Error deleting level: ${error.message}`);
    }
  }
}
