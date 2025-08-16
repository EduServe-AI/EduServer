export interface UserAttributes {
  id: string;
  username: string | null;
  email: string;
  password: string | null;
  role: "student" | "instructor";
  onboarded: boolean;
  googleId?: string | null;
  avatarUrl?: string | null;
  authProvider?: "local" | "google";
  createdAt?: Date; 
  updatedAt?: Date;
}

