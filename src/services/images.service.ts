import { PrismaClient, Image } from '@prisma/client';
import { CreateRecipeDto } from '@dtos/recipes.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class ImageService {
  public image = new PrismaClient().image;

  public async findAllImages(): Promise<Image[]> {
    const allRecipes: Image[] = await this.image.findMany();
    return allRecipes;
  }

  public async createImage(imageData): Promise<Image> {

    if (isEmpty(imageData)) throw new HttpException(400, "imageData is empty");

    const {images}  = imageData;

    const createImageData: Image = await this.image.createMany({data: images});
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
