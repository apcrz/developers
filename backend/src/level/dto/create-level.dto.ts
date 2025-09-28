import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLevelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Level name must be at most 100 characters long' })
  level: string;
}
