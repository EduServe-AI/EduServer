import { Router } from "express";
import { registerStudent } from "../controllers/auth.controller";
import passport from "../config/passport";
import Responder from "../utils/responder";
import { generateToken } from "../utils/jwt";

const router = Router();

router.post("/student-signup", registerStudent)

// Google Sign-In: require existing user
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account", state: "signin" })
);

// Google Sign-Up: create new user if not exists
router.get(
  "/google/signup",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "consent", state: "signup" })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err: any, user: any, info: any) => {
      if (err) {
        return Responder(res, { message: "Google authentication error", httpCode: 500, error: err });
      }
      if (!user) {
        return Responder(res, { message: (info && info.message) || "Google authentication failed", httpCode: 401, error: "GOOGLE_AUTH_FAILED" });
      }
      (req as any).logIn(user, (loginErr: any) => {
        if (loginErr) {
          return Responder(res, { message: "Login failed", httpCode: 500, error: loginErr });
        }
        const token = generateToken((user as any).id, (user as any).role);
        return Responder(res, {
          message: "Authenticated with Google",
          data: { user, token },
          httpCode: 200
        });
      });
    })(req, res, next);
  }
);

router.get("/google/failure", (req, res) => {
  return Responder(res, { message: "Google authentication failed", httpCode: 401, error: "GOOGLE_AUTH_FAILED" });
});

export default router; 