import { NextFunction, Response } from 'express';
import multer from 'multer';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import {  v2 as cloudinary } from 'cloudinary';

const uploadMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:  process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploader = async (path: string) => await cloudinary.uploader.upload(path, {folder: "images"})
    
    try {
        const files = req.files;

        const newFiles = [];

        for(let file of files) {
            const newPath = await uploader(file.path);
            newFiles.push({url: newPath.url, publicId: newPath.public_id});
        }

        req.body.images = newFiles;
        next()
    } catch (error) {
        next(new HttpException(401, 'Something went wrong'));
    }
};

export default uploadMiddleware;