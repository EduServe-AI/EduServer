import dotenv from "dotenv"
import path = require("path");


if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
} 

interface Config {
    port : number;
    nodeEnv : string;
    JWT_SECRET_KEY : string;
    JWT_EXPIRES_IN : string | number;
}

const config : Config = {
    port : Number(process.env.PORT) ,
    nodeEnv : process.env.NODE_ENV || "development" ,
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY!,
    JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN!
}

export default config; 

