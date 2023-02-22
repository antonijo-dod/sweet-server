import { NextFunction, Request, Response } from 'express';
import { User, Recipe } from '@prisma/client';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import recipeService from '@services/recipes.service';

class RecipesController {
  public recipeService = new recipeService();

  public getRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllRecipesData: Recipe[] = await this.recipeService.findAllRecipes();

      res.status(200).json({ data: findAllRecipesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getRecipeBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const recipeId = req.params.slug;
      const findOneRecipeData: Recipe = await this.recipeService.findRecipeBySlug(recipeId);

      res.status(200).json({ data: findOneRecipeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const recipeData: CreateRecipeDto = req.body;
      const createRecipeData: Recipe = await this.recipeService.createRecipe(recipeData, req.user);

      res.status(201).json({ data: createRecipeData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const recipeId = Number(req.params.id);
      const recipeData: CreateRecipeDto = req.body;
      const updateRecipeData: Recipe = await this.recipeService.updateRecipe(recipeId, recipeData);

      res.status(200).json({ data: updateRecipeData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const recipeSlug = req.params.slug;
      const deleteRecipeData: Recipe = await this.recipeService.deleteRecipe(recipeSlug);

      res.status(200).json({ data: deleteRecipeData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  }

}

export default RecipesController;
