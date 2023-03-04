import { NextFunction, Request, Response } from 'express';
import {  Ingredient } from '@prisma/client';
import { CreateIngredientDto } from '@dtos/ingredients.dto';
import ingredientService from '@services/ingredients.service';

class IngredientsController {
  public ingredientService = new ingredientService();

  public getIngredients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const query = req.query;
    
    try {
      const findAllIngredientsData: Ingredient[] = await this.ingredientService.findAllIngredients(query);

      res.status(200).json({ data: findAllIngredientsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createIngredients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateIngredientDto = req.body;
      const createIngredientData: Ingredient = await this.ingredientService.createIngredient(userData);

      res.status(201).json({ data: createIngredientData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const recipeId = Number(req.params.id);
      const deleteIngredientData: Ingredient = await this.ingredientService.deleteIngredient(recipeId);

      res.status(200).json({ data: deleteIngredientData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  }

}

export default IngredientsController;
