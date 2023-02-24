import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  public name: string;

  @IsString()
  public slug: string;
}

