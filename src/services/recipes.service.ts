import { PrismaClient, Recipe } from '@prisma/client';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class RecipeService {
  public recipe = new PrismaClient().recipe;
  public ingredient = new PrismaClient().ingredient;
  public categories = new PrismaClient().category;

  public async findAllRecipes(query): Promise<Recipe[]> {

    const page = Number(query.page);
    const currentPage = page ? page : 1;
    const resultsPerPage = 5;

    let queryFilter = {}

    if (query.search) {
      queryFilter = {
        ...queryFilter,
        name: {
          contains: query.search
        }
      }
    }

    // categories=[1,2]
    if (query.categories) {
      queryFilter = {
        ...queryFilter,
        categories: {
          some: {
            OR: query.categories.split(",").map(categoryId => ({categoryId: Number(categoryId)}))
          }
         }
      }
    }

    const count = await this.recipe.count({
     where: queryFilter
    });
    const totalPages = Math.ceil(count / resultsPerPage);

    const allRecipes: Recipe[] = await this.recipe.findMany({
      include:
      {
        ingredients: { include: { ingredient: true } },
        categories: { include: { category: true } },
        galleryImages: { include: { image: true } },
        featuredImage: true,
      },
      where:queryFilter,
      skip: (currentPage - 1) * resultsPerPage,
      take: resultsPerPage,
    });
    return { data: allRecipes, meta: { count: count, currentPage, totalPages, resultsPerPage } };
  }

  public async findRecipeBySlug(recipeSlug: string): Promise<Recipe> {
    if (isEmpty(recipeSlug)) throw new HttpException(400, "RecipeSlug is empty");

    const findRecipe: Recipe[] = await this.recipe.findMany({ where: { slug: recipeSlug }, include: { ingredients: { include: { ingredient: true } } } });
    if (!findRecipe) throw new HttpException(409, "Recipe doesn't exist");

    return findRecipe[0];
  }

  public async createRecipe(recipeData: CreateRecipeDto, authUser): Promise<Recipe> {
    // Create slug with slugify if slug is not provided from frontend

    if (isEmpty(recipeData)) throw new HttpException(400, "RecipeData is empty");

    const { ingredients, categories, galleryImages, featuredImageId } = recipeData;

    const checkIfIngredientsIdExist = await this.ingredient.findMany({ where: { id: { in: ingredients.map(ingredient => ingredient.id) } } });
    if (checkIfIngredientsIdExist.length !== ingredients.length) throw new HttpException(409, "One or more ingredients doesn't exist");

    const findRecipe: Recipe[] = await this.recipe.findMany({ where: { slug: recipeData.slug } });

    if (findRecipe.length > 0) throw new HttpException(409, `This slug ${recipeData.slug} already exists`);

    const createRecipeData: Recipe = await this.recipe.create({
      data: {
        ...recipeData,
        authorId: authUser.id,
        featuredImageId: featuredImageId,
        ingredients: {
          create: ingredients.map(ingredient => ({
            amount: ingredient.amount,
            ingredient: {
              connect: {
                id: ingredient.id
              }
            }
          }))
        },
        categories: {
          create: categories.map(categoryId => ({
            category: {
              connect: {
                id: categoryId
              }
            }
          }))
        },
        galleryImages: {
          create: galleryImages.map(imageId => ({
            image: {
              connect: {
                id: imageId
              }
            }
          }))
        }
      },
      include: { ingredients: { include: { ingredient: true } }, categories: { include: { category: true } } }
    });
    return createRecipeData;
  }

  public async updateRecipe(recipeId: number, recipeData: CreateRecipeDto): Promise<Recipe> {
    if (isEmpty(recipeData)) throw new HttpException(400, "RecipeData is empty");

    const findRecipe: Recipe = await this.recipe.findUnique({ where: { id: recipeId }, include: { ingredients: true } });
    if (!findRecipe) throw new HttpException(409, "Recipe doesn't exist");

    const { ingredients, categories, images } = recipeData;

    const checkIfIngredientsIdExist = await this.ingredient.findMany({ where: { id: { in: ingredients.map(ingredient => ingredient.id) } } });
    if (checkIfIngredientsIdExist.length !== ingredients.length) throw new HttpException(409, "One or more ingredients doesn't exist");

    const checkIfCategoriesIdExist = await this.categories.findMany({ where: { id: { in: categories.map(categoryId => categoryId) } } });
    if (checkIfCategoriesIdExist.length !== categories.length) throw new HttpException(409, "One or more categories doesn't exist");

    const updateRecipeData = await this.recipe.update({
      where: { id: recipeId }, data: {
        ...recipeData,
        ingredients: {
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
        },
        categories: {
          deleteMany: {
            recipeId: recipeId,
            NOT: categories.map(({ recipeId }) => ({ recipeId })),
          },
          create: categories.map(categoryId => ({
            category: {
              connect: {
                id: categoryId
              }
            }
          }))
        },
        galleryImages: {
          deleteMany: {
            recipeId: recipeId,
            NOT: images.map(({ recipeId }) => ({ recipeId })),
          },
          create: images.map(imageId => ({
            image: {
              connect: {
                id: imageId
              }
            }
          }))
        }
      },
      include: { ingredients: { include: { ingredient: true } }, categories: { include: { category: true } } }
    });
    return updateRecipeData;
  }

  public async deleteRecipe(recipeId: number): Promise<Recipe> {
    // When delete a recipe, delete all ingredients related to this recipe
    if (isEmpty(recipeId)) throw new HttpException(400, "You didn't provide a recipe slug");

    const findRecipe: Recipe = await this.recipe.findUnique({ where: { id: recipeId } });
    if (!findRecipe) throw new HttpException(409, "Recipe doesn't exist");

    const deleteRecipeData = await this.recipe.delete({ where: { id: recipeId } });
    return deleteRecipeData;
  }

}

export default RecipeService;
