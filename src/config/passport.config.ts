import passport from "passport";
import { Request } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findUserByEmail } from "../services/user.service";
import config from "./constants";
import { loginOrCreateAccountService } from "../services/auth.service";
import bcrypt from "bcrypt";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: Function
    ) => {
      try {
        const { email, name, picture, sub: googleId } = profile._json;

        const user = await loginOrCreateAccountService({
          email,
          username: name,
          picture: picture,
          provider: "google",
        });
        done(null, user);
      } catch (error) {
        console.log(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: true },
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // Check if password exists and compare
        if (!user.password) {
          return done(null, false, { message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user));

passport.deserializeUser((user: any, done) => done(null, user));
