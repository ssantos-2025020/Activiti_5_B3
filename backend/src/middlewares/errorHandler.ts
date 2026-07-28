import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      mensaje: err.message,
    });
  }

  return res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor",
  });
}

export function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
