import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { LevelService } from './level.service';
import { RequestLevelDto } from './dto/request-level.dto';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ResponseLevelDto } from './dto/response-level.dto';
import { ResponseListLevelDto } from './dto/response-list-level.dto';
import { ParamIdDto } from '../common/dto/param-id.dto';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) { }

  @Post()
  async create(@Body() createLevelDto: CreateLevelDto): Promise<ResponseLevelDto> {
    return this.levelService.create(createLevelDto);
  }

  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @Query() query: RequestLevelDto
  ): Promise<{ data: ResponseListLevelDto[], totalCount: number }> {
    const { level, page } = query;
    return this.levelService.findAll(level, page);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param() params: ParamIdDto): Promise<ResponseLevelDto> {
    return this.levelService.findOne(params.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param() params: ParamIdDto,
    @Body() updateLevelDto: UpdateLevelDto
  ): Promise<ResponseLevelDto> {
    return this.levelService.update(params.id, updateLevelDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  remove(
    @Param() params: ParamIdDto
  ): Promise<void> {
    return this.levelService.remove(params.id);
  }
}
