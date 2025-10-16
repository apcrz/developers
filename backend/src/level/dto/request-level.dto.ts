import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestLevelDto {
   @IsOptional()
   @IsInt()
   @Min(1)
   @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
   page?: number = 1;

   @IsOptional()
   @IsString()
   level?: string;
}