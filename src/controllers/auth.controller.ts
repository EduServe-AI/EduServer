import { NextFunction, Request, Response } from "express";
import { findUserByEmail, createStudent } from "../services/user.service";
import { generateToken } from "../utils/jwt";
import Responder from "../utils/responder";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import config from "../config/constants";
import { registerUserService } from "../services/auth.service";
import { registerSchema } from "../validation/auth.validation";
import { HTTP_STATUS } from "../config/http.config";
import passport from "passport";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const user = await registerUserService(body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: "User created successfully",
      data: {
        user,
      },
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.status(HTTP_STATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "No active session to logout",
      });
    }

    // Handle logout with Promise
    await new Promise<void>((resolve, reject) => {
      req.logout((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Destroy session if it exists
    if (req.session) {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }

    // Clear session cookie
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

export const googleLoginCallBackController = asyncHandler(
  async (req: Request, res: Response) => {
    return res.redirect(`${config.FRONTEND_ORIGIN}/`);
  }
);
