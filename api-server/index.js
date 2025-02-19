import express from "express";
import deployementRouter from "./routers/deployementRouter.js";
import { initRedisSubscribe } from "./controllers/LogsSender.js";
const app = express();
const PORT = 9000;

initRedisSubscribe();
app.use(express.json());
app.use("/deploy", deployementRouter);
app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
