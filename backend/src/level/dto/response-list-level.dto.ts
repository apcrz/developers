import { PartialType } from '@nestjs/mapped-types';
import { ResponseLevelDto } from './response-level.dto';

export class ResponseListLevelDto extends PartialType(ResponseLevelDto) {}
