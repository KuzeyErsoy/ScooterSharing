import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateScooterDto {
    @IsString()
    name: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    battery: number;
}
