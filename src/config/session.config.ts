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
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
