import { IsEmail, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  public name: string;

  @IsString()
  public slug: string;

  @IsString()
  public description: string;
}

