import "dotenv/config";
import express from "express";
import deployementRouter from "./routers/deployementRouter.js";
import projectRouter from "./routers/projectRouter.js";
import logsRouter from "./routers/logsRouter.js";
import { initKafkaConsumer } from "./controllers/kafkaConsumer.js";
import userRouter from "./routers/userRouter.js";
import { connectDB } from "./config/database.js";
import cookie from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = 9000;

const allowedOrigins = [
  "https://ihtishamhassanltd.com", 
  "http://ihtishamhassanltd.com",  
  "http://204.236.237.162"         
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-XSRF-TOKEN"]
};

app.options("*", cors(corsOptions)); 
app.use(cors(corsOptions));
app.use(cookie());
await connectDB();

initKafkaConsumer();
app.use(express.json());
app.use("api/user", userRouter);
app.use("/project", projectRouter);
app.use("/logs", logsRouter);
app.use("/deploy", deployementRouter);

app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
