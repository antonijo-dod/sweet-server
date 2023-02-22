import { hash } from 'bcrypt';
import { PrismaClient, Recipe } from '@prisma/client';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class RecipeService {
  public recipe = new PrismaClient().recipe;

  public async findAllRecipes(): Promise<Recipe[]> {
    const allRecipes: Recipe[] = await this.recipe.findMany({ include: { ingredients: true } });
    return allRecipes;
  }

  public async findRecipeBySlug(recipeSlug: string): Promise<Recipe> {
    if (isEmpty(recipeSlug)) throw new HttpException(400, "RecipeSlug is empty");

    const findRecipe: Recipe[] = await this.recipe.findMany({ where: { slug: recipeSlug } });
    if (!findRecipe) throw new HttpException(409, "Recipe doesn't exist");

    return findRecipe[0];
  }

  public async createRecipe(recipeData: CreateRecipeDto, authUser): Promise<Recipe> {
    // Create slug with slugify if slug is not provided from frontend

    if (isEmpty(recipeData)) throw new HttpException(400, "RecipeData is empty");

    const { ingredients } = recipeData;

    const findRecipe: Recipe[] = await this.recipe.findMany({ where: { slug: recipeData.slug } });
    if (findRecipe.length > 0) throw new HttpException(409, `This slug ${recipeData.slug} already exists`);

    const createRecipeData: Recipe = await this.recipe.create({ data: { ...recipeData, authorId: authUser.id, ingredients: {
      
    }}});
    return createRecipeData;
  }

  public async updateRecipe(recipeId: number, recipeData: CreateRecipeDto): Promise<Recipe> {
    if (isEmpty(recipeData)) throw new HttpException(400, "RecipeData is empty");

    
    const findRecipe: Recipe = await this.recipe.findUnique({ where: { id: recipeId } });
    if (!findRecipe) throw new HttpException(409, "Recipe doesn't exist");
    
    const { ingredients } = recipeData;
    
    const updateRecipeData = await this.recipe.update({ where: { id: recipeId }, data: { ...recipeData} });
    return updateRecipeData;
  }

  public async deleteRecipe(recipeSlug: string): Promise<Recipe> {
    if (isEmpty(recipeSlug)) throw new HttpException(400, "You didn't provide a recipe slug");

    const findRecipe: Recipe[] = await this.recipe.findMany({ where: { slug: recipeSlug } });
    if (!findRecipe[0]) throw new HttpException(409, "Recipe doesn't exist");

    const deleteRecipeData = await this.recipe.delete({ where: { id: findRecipe[0].id } });
    return deleteRecipeData;
  }

}

export default RecipeService;
