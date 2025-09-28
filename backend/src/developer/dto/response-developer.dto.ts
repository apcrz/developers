import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ResponseDeveloperDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    gender: string;

    @Expose({ name: 'birthDate' })
    @Transform(({ value }) => value.toISOString().split('T')[0]) // Formatar como YYYY-MM-DD
    birthdate: Date;

    @Expose()
    hobby: string;

    @Expose()
    level: {
        id: number;
        level: string;
    };
}