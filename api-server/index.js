import express from "express";
import deployementRouter from "./routers/deployementRouter.js";
import { configDotenv } from "dotenv";
import { initRedisSubscribe } from "./controllers/LogsSender.js";
import userRouter from "./routers/userRouter.js"
import { connectDB } from "./config/database.js";

configDotenv();
const app = express();
const PORT = 9000;


await connectDB();
initRedisSubscribe();
app.use(express.json());
app.use("/user", userRouter)
app.use("/deploy", deployementRouter);
app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
