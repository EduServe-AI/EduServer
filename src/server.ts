import app from "./app";
import config from "./config/constants";
import { connectDB } from "./config/db.config";

// App connection with express
app.listen(config.PORT, async () => {
  console.log(
    `🚀 Server running on http://localhost:${config.PORT} in ${config.NODE_ENV}`
  );
  await connectDB();
});
