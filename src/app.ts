import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import morgan from "morgan";
import config from "./config/constants";
import "./config/passport.config";
import { configureSession } from "./config/session.config";

const BASE_PATH = config.BASE_PATH;

const app = express();

// Handling Cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging HTTP requests

app.use(morgan("dev"));

configureSession(app);

// Regsitering the routes
app.use(`${BASE_PATH}/auth`, authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Eduserve Backend </h1>");
});

export default app;
