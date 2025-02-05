import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { verify } from "jsonwebtoken";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");
  const token = socket.handshake.auth as { token: string };
  try {
    const tokenVerification = verify(token.token, process.env.JWT_SECRET!) as {
      id: string;
    };
    socket.emit("authorized", tokenVerification.id);
  } catch (err) {
    socket.emit("unauthorized", "Unauthorized login again");
  }

  socket.on("connect_friend", (roomId) => {
    socket.join(roomId);
    socket.broadcast.emit(roomId, "hi");
  });
});

httpServer.listen(3000, () => {
  console.log("Listening at: http://localhost:3000");
});
