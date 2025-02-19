import { Server } from "socket.io";
import Redis from "ioredis";
import { configDotenv } from "dotenv";
configDotenv();
const subscriber = new Redis(process.env.RedisUrl, {
  tls: {
    rejectUnauthorized: false,
  },
});

// Adding an error handler for the Redis connection to log errors gracefully
subscriber.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });
});

export const initRedisSubscribe = async () => {
  io.listen(9002, () => console.log("Socket Server 9002"));
  console.log("Subscribed to logs....");
  subscriber.psubscribe("logs:*");
  subscriber.on("pmessage", (pattern, channel, message) => {
    io.to(channel).emit("message", message);
  });
};
