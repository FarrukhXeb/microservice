import morgan, { StreamOptions } from 'morgan';
import { Request, Response, NextFunction } from 'express';

const stream: StreamOptions = {
  write: (message: string) => console.log(message),
};

morgan.token('message', (req: Request, res: Response) => res.statusMessage || '');

const getIpFormat = () => (process.env.NODE_ENV === 'production' ? ':remote-addr - ' : '');

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - :res[content-length]`;

const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - :res[content-length] - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream,
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream,
});

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Not Found');
  return next(err);
};

export const developmentErrors = (
  err: { message: string; status?: number; stack?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack,
  };
  res.status(err.status || 500).json(errorDetails);
};

export const productionErrors = (
  err: { message: string; status?: number; stack?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
  });
};
