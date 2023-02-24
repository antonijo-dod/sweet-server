import { hash } from 'bcrypt';
import { PrismaClient, Recipe } from '@prisma/client';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class RecipeService {
  public recipe = new PrismaClient().recipe;
  public ingredient = new PrismaClient().ingredient;

  public async findAllRecipes(): Promise<Recipe[]> {
    const allRecipes: Recipe[] = await this.recipe.findMany({ include: { ingredients: {include: {ingredient: true}} } });
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

    const checkIfIngredientsIdExist = await this.ingredient.findMany({ where: { id: { in: ingredients.map(ingredient => ingredient.id) } } });
    if (checkIfIngredientsIdExist.length !== ingredients.length) throw new HttpException(409, "One or more ingredients doesn't exist");

    const findRecipe: Recipe[] = await this.recipe.findMany({ where: { slug: recipeData.slug } });
    if (findRecipe.length > 0) throw new HttpException(409, `This slug ${recipeData.slug} already exists`);

    const createRecipeData: Recipe = await this.recipe.create({ data: { ...recipeData, authorId: authUser.id, ingredients: {
      create: ingredients.map(ingredient => ({ 
        amount: ingredient.amount, 
        ingredient: {
          connect: {
            id: ingredient.id
          }
        } 
      }))
    }}});
    return createRecipeData;
  }

  public async updateRecipe(recipeId: number, recipeData: CreateRecipeDto): Promise<Recipe> {
    if (isEmpty(recipeData)) throw new HttpException(400, "RecipeData is empty");

    const findRecipe: Recipe = await this.recipe.findUnique({ where: { id: recipeId }, include: { ingredients: true } });
    if (!findRecipe) throw new HttpException(409, "Recipe doesn't exist");
    
    const { ingredients } = recipeData;
    
    const updateRecipeData = await this.recipe.update({ where: { id: recipeId }, data: { ...recipeData, ingredients: {
     deleteMany: {
      recipeId: recipeId,
      NOT: ingredients.map(({ recipeId }) => ({ recipeId })),
     },
      create: ingredients.map(ingredient => ({
        amount: ingredient.amount, 
        ingredient: {
          connect: {
            id: ingredient.id
          }
        } 
      }))
    }}});
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
