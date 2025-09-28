import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { ResponseListDeveloperDto } from './dto/response-list-developer.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { ResponseDeveloperDto } from './dto/response-developer.dto';
import { Prisma, Gender } from '@prisma/client';

interface FilterOptions {
  level?: string;
  name?: string;
  gender?: Gender;
  hobby?: string;
}

@Injectable()
export class DeveloperService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDeveloperDto: CreateDeveloperDto): Promise<ResponseDeveloperDto> {
    try {
      const developer = await this.prisma.developer.create({
        data: {
          name: createDeveloperDto.name,
          levelId: createDeveloperDto.levelId,
          gender: createDeveloperDto.gender,
          birthDate: new Date(createDeveloperDto.birthDate),
          hobby: createDeveloperDto.hobby,
        },
        include: {
          level: true,
        },
      });
      return plainToInstance(ResponseDeveloperDto, developer, { excludeExtraneousValues: true });

    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(`Developer with name "${createDeveloperDto.name}" already exists.`);
      }

      if (error.code === 'P2003') {
        throw new NotFoundException(`Level with ID "${createDeveloperDto.levelId}" not found.`);
      }
      throw new BadRequestException(`Error creating developer`);
    }
  }

  async findAll(
    page: number = 1,
    filters: FilterOptions
  ): Promise<{ data: ResponseListDeveloperDto[]; totalCount: number }> {
    const { level, name, gender, hobby } = filters;

    if (gender && !Object.values(Gender).includes(gender as Gender)) {
      return { data: [], totalCount: 0 };
    }
    
    const where: Prisma.DeveloperWhereInput = {};

    if (level) {
      where.level = { level: { contains: level } };
    }

    if (name) {
      where.name = { contains: name };
    }

    if (gender) {
      where.gender = gender;
    }

    if (hobby) {
      where.hobby = { contains: hobby };
    }

    const recordsPerPage = process.env.RECORDS_PER_PAGE
      ? parseInt(process.env.RECORDS_PER_PAGE, 10)
      : 25;

    const skip = Math.max((page || 1) - 1, 0) * recordsPerPage;

    try {
      const [developers, totalCount] = await this.prisma.$transaction([
        this.prisma.developer.findMany({
          where,
          skip,
          take: recordsPerPage,
          include: {
            level: true,
          },
        }),
        this.prisma.developer.count({ where }),
      ]);

      const data = plainToInstance(ResponseListDeveloperDto, developers, {
        excludeExtraneousValues: true
      });

      return { data, totalCount };
    } catch (error) {
      throw new BadRequestException(`Error finding developers`);
    }
  }

  async findOne(id: number): Promise<ResponseDeveloperDto> {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: {
        level: true,
      },
    });

    if (!developer) {
      throw new NotFoundException(`Developer with ID "${id}" not found.`);
    }

    return plainToInstance(ResponseDeveloperDto, developer, {
      excludeExtraneousValues: true
    });
  }

  async update(
    id: number,
    updateDeveloperDto: UpdateDeveloperDto
  ): Promise<ResponseDeveloperDto> {
    try {
      const data: any = { ...updateDeveloperDto };

      if (updateDeveloperDto.birthDate) {
        data.birthDate = new Date(updateDeveloperDto.birthDate);
        delete data.birthDate;
      }

      const updatedDeveloper = await this.prisma.developer.update({
        where: { id },
        data,
        include: {
          level: true,
        },
      });

      return plainToInstance(ResponseDeveloperDto, updatedDeveloper, {
        excludeExtraneousValues: true
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Developer with ID "${id}" not found.`);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(`Level with ID "${updateDeveloperDto.levelId}" not found.`);
      }
      throw new BadRequestException(`Error updating developer`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.developer.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Developer with ID "${id}" not found.`);
      }
      throw new BadRequestException(`Error deleting developer}`);
    }
  }
}