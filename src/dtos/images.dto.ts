import { IsEmail, IsString, IsArray } from 'class-validator';

export class CreateImageDto {
    @IsString()
    public url: string;

    @IsString()
    public public_id: string;
}

