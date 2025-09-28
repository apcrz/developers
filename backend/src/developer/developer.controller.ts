import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { ResponseDeveloperDto } from './dto/response-developer.dto';
import { ResponseListDeveloperDto } from './dto/response-list-developer.dto';
import { ParamIdDto } from '../common/dto/param-id.dto';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';
import { Gender } from '@prisma/client';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) { }

  @Post()
  create(@Body() createDeveloperDto: CreateDeveloperDto): Promise<ResponseDeveloperDto> {
    return this.developerService.create(createDeveloperDto);
  }

  @UseInterceptors(PaginationInterceptor)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('level') level: string,
    @Query('name') name: string,
    @Query('gender') gender: Gender,
    @Query('hobby') hobby: string
  ): Promise<{ data: ResponseListDeveloperDto[], totalCount: number }> {
    return this.developerService.findAll(page, { level, name, gender, hobby });
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param() params: ParamIdDto): Promise<ResponseDeveloperDto> {
    return this.developerService.findOne(params.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param() params: ParamIdDto, @Body() updateDeveloperDto: UpdateDeveloperDto) {
    return this.developerService.update(params.id, updateDeveloperDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  remove(@Param() params: ParamIdDto) {
    return this.developerService.remove(params.id);
  }
}
