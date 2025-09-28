import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseLevelDto {
  @Expose()
  id: number;

  @Expose()
  level: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}