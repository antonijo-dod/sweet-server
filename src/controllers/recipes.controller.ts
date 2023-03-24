import { NextFunction, Request, Response } from 'express';
import { Recipe } from '@prisma/client';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import recipeService from '@services/recipes.service';
import { Meta } from '@interfaces/meta.interface';
import { RequestWithUser } from '@interfaces/auth.interface';

class RecipesController {
    public recipeService = new recipeService();

    public getRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const query = req.query;

        try {
            const { data, meta }: { data: Recipe[]; meta: Meta } = await this.recipeService.findAllRecipes(query);

            res.status(200).json({ data, meta });
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

    public createRecipe = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
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
            const recipeId = Number(req.params.id);
            const deleteRecipeData: Recipe = await this.recipeService.deleteRecipe(recipeId);

            res.status(200).json({ data: deleteRecipeData, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };

    public updateStatusRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const recipeId = Number(req.params.id);
            const recipeStatus = req.body.status;

            const updateRecipeStatus: Recipe = await this.recipeService.updateStatusRecipe(recipeId, recipeStatus);
            res.status(200).json({ data: updateRecipeStatus, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };
}

export default RecipesController;
