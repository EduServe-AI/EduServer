import express , { Request , Response } from "express"
import authRoutes from "./routes/auth.routes"
import cors from "cors"
import morgan from "morgan"
import session from "express-session"
import config from "./config/constants"
import passport from "./config/passport"

const app = express();


// Handling Cors
app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  })
)


app.use(express.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || config.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    }
  })
)

app.use(passport.initialize());
app.use(passport.session());

// Regsitering the routes
app.use("/api/v1/auth" , authRoutes)


app.get('/' , (req : Request , res : Response) => {
    res.send("<h1>Eduserve Backend </h1>"); 
})

export default app; 