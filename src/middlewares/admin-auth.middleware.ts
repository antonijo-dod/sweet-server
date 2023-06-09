import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';

const adminAuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  console.log("🚀 ~ file: admin-auth.middleware.ts:9 ~ adminAuthMiddleware ~ req:", req.header('Authorization'))
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse.id;

      const users = new PrismaClient().user;
      const findUser = await users.findUnique({ where: { id: Number(userId) } });

      if (findUser) {
        if(findUser.role === 'ADMIN')  {
            req.user = findUser;
            next();
        } else {
            next(new HttpException(401, 'You are not authorized to access this route'));
        }
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default adminAuthMiddleware;
