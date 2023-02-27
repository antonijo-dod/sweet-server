import { Router } from 'express';
import ImagesController from '@controllers/images.controller';
import { CreateImageDto } from '@dtos/images.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import adminAuthMiddleware from '@middlewares/admin-auth.middleware';
import uploadMiddleware from '@/middlewares/upload-image.middleware';
import multer from 'multer';

const storage = multer.diskStorage({})

let upload = multer({ storage: storage })

class ImagesRoute implements Routes {
  public path = '/images';
  public router = Router();
  public imagesController = new ImagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.imagesController.getImages);
    this.router.post(`${this.path}`, upload.array("photos", 12), adminAuthMiddleware, uploadMiddleware, this.imagesController.createImages);
    this.router.delete(`${this.path}/:id(\\d+)`, adminAuthMiddleware, this.imagesController.deleteImage);
  }
}

export default ImagesRoute;
