import { NextFunction, Request, Response } from 'express';
import { User, Category } from '@prisma/client';
import { CreateCategoryDto } from '@dtos/categories.dto';
import categoryService from '@services/categories.service';
import { Meta } from '@interfaces/meta.interface';

class CategoriesController {
    public categoryService = new categoryService();

    public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const query = req.query;
        try {
            const { data, meta }: { data: Category[]; meta: Meta } = await this.categoryService.findAllCategories(query);

            res.status(200).json({ data, meta });
        } catch (error) {
            next(error);
        }
    };

    public getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categorySlug = req.params.slug;
            const findOneCategoryData: Category = await this.categoryService.findCategoryBySlug(categorySlug);

            res.status(200).json({ data: findOneCategoryData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categoryData: CreateCategoryDto = req.body;
            const createCategoryData: Category = await this.categoryService.createCategory(categoryData);

            res.status(201).json({ data: createCategoryData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categoryId = Number(req.params.id);
            const recipeData: CreateCategoryDto = req.body;
            const updateCategoryData: Category = await this.categoryService.updateCategory(categoryId, recipeData);

            res.status(200).json({ data: updateCategoryData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categoryId = Number(req.params.id);
            const deleteCategoryData: Category = await this.categoryService.deleteCategory(categoryId);

            res.status(200).json({ data: deleteCategoryData, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}

export default CategoriesController;
