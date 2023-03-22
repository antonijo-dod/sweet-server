import { PrismaClient, Category } from '@prisma/client';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Meta } from '@interfaces/meta.interface';

class CategoryService {
    public category = new PrismaClient().category;
    public recipe = new PrismaClient().recipe;
    public categoryOnRecipe = new PrismaClient().categoryOnRecipe;

    public async findAllCategories(query): Promise<{ data: Category[]; meta: Meta }> {
        const page = Number(query.page);
        const currentPage = page ? page : 1;
        const resultsPerPage = 4;

        const queryFilter = {};

        const count = await this.category.count({
            where: queryFilter,
        });

        const totalPages = Math.ceil(count / resultsPerPage);

        const allCategories: Category[] = await this.category.findMany({
            where: queryFilter,
            skip: (currentPage - 1) * resultsPerPage,
            take: resultsPerPage,
        });
        return { data: allCategories, meta: { count: count, currentPage, totalPages, resultsPerPage } };
    }

    public async findCategoryBySlug(categorySlug: string): Promise<Category> {
        if (isEmpty(categorySlug)) throw new HttpException(400, 'categorySlug is empty');

        const findCategory: Category[] = await this.category.findMany({ where: { slug: categorySlug } });
        if (!findCategory) throw new HttpException(409, "Category doesn't exist");

        return findCategory[0];
    }

    public async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
        // Create slug with slugify if slug is not provided from frontend

        if (isEmpty(categoryData)) throw new HttpException(400, 'Category data is empty');

        const findCategories: Category[] = await this.category.findMany({ where: { slug: categoryData.slug } });
        if (findCategories.length > 0) throw new HttpException(409, `This slug ${categoryData.slug} already exists`);

        const createCategoryData: Category = await this.category.create({ data: { ...categoryData } });
        return createCategoryData;
    }

    public async updateCategory(categoryId: number, categoryData: CreateCategoryDto): Promise<Category> {
        if (isEmpty(categoryData)) throw new HttpException(400, 'Category data is empty');

        const findCategory: Category = await this.category.findUnique({ where: { id: categoryId } });
        if (!findCategory) throw new HttpException(409, "Category doesn't exist");

        const updateCategoryData = await this.category.update({ where: { id: categoryId }, data: { ...categoryData } });
        return updateCategoryData;
    }

    public async deleteCategory(categoryId: number): Promise<Category> {
        if (isEmpty(categoryId)) throw new HttpException(400, "You didn't provide a category id");

        const findCategory: Category = await this.category.findUnique({ where: { id: categoryId } });
        if (!findCategory) throw new HttpException(409, "Category doesn't exist");
        // Delete all category realtionship that belong to this category
        const deleteReation = await this.categoryOnRecipe.deleteMany({ where: { categoryId: categoryId } });
        if (!deleteReation) throw new HttpException(409, "Can't delete relationship");

        const deleteCategoryData = await this.category.delete({ where: { id: categoryId } });
        return deleteCategoryData;
    }
}

export default CategoryService;
