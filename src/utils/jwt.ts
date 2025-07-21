import jwt , {SignOptions} from "jsonwebtoken"
import config from "../config/constants";

export const generateToken = (userId : string , role : string) => {
   const payload  = { userId , role};
   const options : SignOptions = {
    expiresIn : config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
   }

   return jwt.sign(payload , config.JWT_SECRET_KEY as jwt.Secret , options)
}