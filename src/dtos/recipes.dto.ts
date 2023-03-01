import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  public name: string;

  @IsString()
  public slug: string;

  @IsString()
  public description: string;

  @IsString()
  public featuredImage: number;

  @IsArray()
  public ingredients: {amount: string, id: number}[]

  @IsArray()
  public categories: []

  @IsArray()
  public galleryImages: []

  @IsNumber()
  public featuredImageId: number
}

