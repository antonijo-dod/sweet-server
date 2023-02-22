import { Router } from 'express';
import IngredientsController from '@controllers/ingredients.controller';
import { CreateIngredientDto } from '@dtos/ingredients.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import adminAuthMiddleware from '@middlewares/admin-auth.middleware';

class IngredientsRoute implements Routes {
  public path = '/ingredients';
  public router = Router();
  public ingredientsController = new IngredientsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.ingredientsController.getIngredients);
    this.router.post(`${this.path}`, adminAuthMiddleware, validationMiddleware(CreateIngredientDto, 'body'), this.ingredientsController.createIngredients);
    this.router.delete(`${this.path}/:id(\\d+)`, adminAuthMiddleware, this.ingredientsController.deleteIngredient);
  }
}

export default IngredientsRoute;
