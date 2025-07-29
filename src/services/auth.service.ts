import User from "../models/user.model";
import bcrypt from "bcrypt";

export const registerUserService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { name, email, password } = data;
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: name,
      email,
      picture: null, // No picture provided during registration
      password: hashedPassword,
      role: "student", // Default role
      onboarded: false,
      isVerified: false,
    });
    return user;
  } catch (error) {
    console.error("Error during user registration:", error);
    throw new Error("Registration failed");
  }
};

export const loginOrCreateAccountService = async (data: {
  provider: string;
  picture?: string;
  email: string;
  username?: string;
}) => {
  const { provider, email, picture, username } = data;
  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({
      username: username,
      email,
      password: null, // No password for social login
      picture: picture || null,
      role: "student",
      onboarded: false,
      isVerified: provider == "google" ? true : false, // Assuming social logins are verified
    });
  }

  return user;
};

export const verifyUserService = async ({
  email,
  password,
  provider = "email",
}: {
  email: string;
  password?: string;
  provider?: string;
}) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  if (provider === "email" && user.password && password) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
  }
  return user;
};
