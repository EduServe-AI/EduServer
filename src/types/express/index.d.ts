import { UserAttributes } from "../../models/types";

declare global {
  namespace Express {
    interface User extends Partial<UserAttributes> {}
  }
}

export {};