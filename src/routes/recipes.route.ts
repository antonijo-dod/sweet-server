import { Router } from 'express';
import RecipesController from '@controllers/recipes.controller';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import adminAuthMiddleware from '@middlewares/admin-auth.middleware';

class RecipesRoute implements Routes {
  public path = '/recipes';
  public router = Router();
  public recipesController = new RecipesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.recipesController.getRecipes);
    this.router.get(`${this.path}/:slug`, this.recipesController.getRecipeBySlug);
    this.router.post(`${this.path}`, adminAuthMiddleware, this.recipesController.createRecipe);
    this.router.put(`${this.path}/:id(\\d+)`, adminAuthMiddleware, validationMiddleware(CreateRecipeDto, 'body', true), this.recipesController.updateRecipe);
    this.router.delete(`${this.path}/:id(\\d+)`, adminAuthMiddleware, this.recipesController.deleteRecipe);
  }
}

export default RecipesRoute;
