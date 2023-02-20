import { IsEmail, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  public name: string;

}

