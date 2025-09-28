import { IsString, IsNotEmpty, MaxLength, IsNumber, IsPositive, IsDateString, IsUppercase } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateDeveloperDto {
    @IsNumber()
    @IsPositive()
    levelId: number;
 
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsUppercase()
    gender: Gender;

    @IsDateString()
    birthDate: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    hobby: string;

}