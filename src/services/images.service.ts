import { PrismaClient, Image } from '@prisma/client';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Meta } from '@interfaces/meta.interface';

class ImageService {
    public image = new PrismaClient().image;

    public async findAllImages(query): Promise<{ data: Image[]; meta: Meta }> {
        const page = Number(query.page);
        const currentPage = page ? page : 1;
        const resultsPerPage = 6;

        const queryFilter = {};

        const count = await this.image.count({
            where: queryFilter,
        });

        const totalPages = Math.ceil(count / resultsPerPage);

        const allImages: Image[] = await this.image.findMany({
            where: queryFilter,
            skip: (currentPage - 1) * resultsPerPage,
            take: resultsPerPage,
        });
        return { data: allImages, meta: { count, currentPage, totalPages, resultsPerPage } };
    }

    public async createImage(imageData): Promise<Image> {
        if (isEmpty(imageData)) throw new HttpException(400, 'imageData is empty');

        const { images } = imageData;

        const createImageData: Image = await this.image.createMany({ data: images });
        return createImageData;
    }

    public async deleteImage(imageId: number): Promise<Image> {
        if (isEmpty(imageId)) throw new HttpException(400, "You didn't provide a recipe slug");

        const findImage: Image = await this.image.findUnique({ where: { id: imageId } });
        if (!findImage) throw new HttpException(409, "Recipe doesn't exist");

        const deleteImageData = await this.image.delete({ where: { id: imageId } });
        return deleteImageData;
    }
}

export default ImageService;
