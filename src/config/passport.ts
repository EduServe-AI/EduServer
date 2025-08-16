import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import dotenv from "dotenv";
import path from "path";
import { findUserByEmail, findUserById, createUserFromGoogleProfile } from "../services/user.service";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findUserById(id);
    return done(null, user || undefined);
  } catch (error) {
    return done(error as any, undefined);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback",
      passReqToCallback: true
    },
    async (req: any, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const mode = (req.query.state as string) || "signin"; // expected "signin" | "signup"

        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined;
        if (!email) {
          return done(null, false, { message: "Google account does not have a public email" });
        }

        const displayName = profile.displayName || "";
        const photo = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
        const googleId = profile.id;

        if (mode === "signin") {
          const existingUser = await findUserByEmail(email);
          if (!existingUser) {
            return done(null, false, { message: "Account not found. Please sign up first." });
          }
          return done(null, existingUser as any);
        }

        // signup flow
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          return done(null, existingUser as any);
        }

        const newUser = await createUserFromGoogleProfile({
          email,
          username: displayName,
          googleId,
          avatarUrl: photo
        });

        return done(null, newUser as any);
      } catch (error) {
        return done(error as any, undefined);
      }
    }
  )
);

export default passport;