import { NextFunction, Request, Response } from "express";

type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Middleware to handle async errors in controllers.
 * It catches any errors thrown in the controller and passes them to the next middleware.
 */

export default function asyncHandler(controller: AsyncControllerType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
