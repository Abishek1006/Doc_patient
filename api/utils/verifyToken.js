import jwt from 'jsonwebtoken';
import { AppError } from './error.js';
import logger from './logger.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    
    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    jwt.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new AppError(401, 'Token expired');
        }
        throw new AppError(403, 'Invalid token');
      }
      
      req.user = decoded;
      logger.info(`Authenticated user: ${decoded.id}`);
      next();
    });
  } catch (err) {
    next(err);
  }
};
export const verifyUser = (req, res, next) => {
  if (req.user.id || req.user.isAdmin || req.user.isDoctor) {
    next();
  } else {
    return next(createError(403, "You are not authorized!"));
  }
};
export const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return next(createError(403, "You are not authorized!"));
  }
};