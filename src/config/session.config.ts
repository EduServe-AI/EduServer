import passport from "passport";
import { Application } from "express";
import session from "express-session";
import config from "./constants";

export const configureSession = (app: Application) => {
  // configureSession(app);
  app.use(
    session({
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
