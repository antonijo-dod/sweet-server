import { NextFunction, Request, Response } from 'express';
import {   Image } from '@prisma/client';
import { CreateImageDto } from '@dtos/images.dto';
import imageService from '@services/images.service';

class ImagesController {
  public imageService = new imageService();

  public getImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllImages: Image[] = await this.imageService.findAllImages();

      res.status(200).json({ data: findAllImages, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const imageData: CreateImageDto = req.body;
      const createImageData: Image = await this.imageService.createImage(imageData);

      res.status(201).json({ data: createImageData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Delete from cloudinary
    // Delete from the database
    
    try {
      const imageId = Number(req.params.id);
      const deleteImageData: Image = await this.imageService.deleteImage(imageId);

      res.status(200).json({ data: deleteImageData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  }

}

export default ImagesController;
