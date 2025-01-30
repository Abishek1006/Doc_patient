import logger from './logger.js';

export class AppError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
      this.operational = true;
      Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res, next) => {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });

    if (err instanceof AppError) {
      return res.status(err.status).json({
        status: 'error',
        message: err.message
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
};