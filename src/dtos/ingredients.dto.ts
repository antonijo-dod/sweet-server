import { IsEmail, IsString, IsArray } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  public name: string;

  
}

