import User from "../models/user.model";
import bcrypt from "bcryptjs"

export const findUserByEmail = async (email : string) => {
    return await User.findOne({ where : { email}})
}

export const findUserById = async (id: string) => {
  return await User.findByPk(id);
}

export const createStudent = async(username : string , email : string , password : string) => {
    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await User.create({
        username , 
        email , 
        password : hashedPassword, 
        role : "student",
        onboarded : false,
        authProvider: "local"
    })

    return user; 
       
}

export const createUserFromGoogleProfile = async ({
  email,
  username,
  googleId,
  avatarUrl
}: { email: string; username: string; googleId: string; avatarUrl: string | null }) => {
  const user = await User.create({
    email,
    username,
    password: null,
    role: "student",
    onboarded: false,
    googleId,
    avatarUrl,
    authProvider: "google"
  });
  return user;
}