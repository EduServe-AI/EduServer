import { Router } from "express";
import {
  googleLoginCallBackController,
  loginController,
  logoutController,
  registerUserController,
} from "../controllers/auth.controller";
import passport from "passport";
import { registerUserService } from "../services/auth.service";

const authRouter = Router();

authRouter.post("/signup", registerUserController);

authRouter.post("/login", loginController);

authRouter.post("/logout", logoutController);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get("/test", () => console.log("Test route hit"));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleLoginCallBackController
);

export default authRouter;
