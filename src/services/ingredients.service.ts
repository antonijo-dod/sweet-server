import { PrismaClient, Ingredient } from '@prisma/client';
import { CreateIngredientDto } from '@dtos/ingredients.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class IngredientService {
    public ingredients = new PrismaClient().ingredient;

    public async findAllIngredients(query): Promise<Ingredient[]> {
        let queryFilter = {};

        if (query.search) {
            queryFilter = {
                ...queryFilter,
                name: {
                    contains: query.search,
                },
            };
        }

        const allIngredients: Ingredient[] = await this.ingredients.findMany({
            where: queryFilter,
        });
        return allIngredients;
    }

    public async createIngredient(ingredientData: CreateIngredientDto): Promise<Ingredient> {
        // Create slug with slugify if slug is not provided from frontend

        if (isEmpty(ingredientData)) throw new HttpException(400, 'Ingredient data is empty');

        const findIngredient: Ingredient[] = await this.ingredients.findMany({ where: { name: ingredientData.name } });
        if (findIngredient.length > 0) throw new HttpException(409, `This name ${ingredientData.name} already exists`);

        const createIngredientData: Ingredient = await this.ingredients.create({ data: { ...ingredientData } });
        return createIngredientData;
    }

    public async deleteIngredient(ingredientId: number): Promise<Ingredient> {
        if (isEmpty(ingredientId)) throw new HttpException(400, "You didn't provide a ingredient id");

        const findIngredient: Ingredient = await this.ingredients.findUnique({ where: { id: ingredientId } });
        if (!findIngredient) throw new HttpException(409, "Ingredient doesn't exist");

        const deleteIngredientData = await this.ingredients.delete({ where: { id: ingredientId } });
        return deleteIngredientData;
    }
}

export default IngredientService;
