import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";
import { CLIENT_EVENTS, SERVER_EVENTS } from "./constants/events";
import { UNAUTHORIZED_ERROR } from "./constants/errors";
import { EVENT_NAME } from "./constants/constants";

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const users = new Map();
console.clear();

io.on(SERVER_EVENTS.CONNECTION, (socket) => {
  const token = socket.handshake.auth as { token: string };

  try {
    const tokenVerification = verify(token.token, process.env.JWT_SECRET!) as { id: string };
    users.set(tokenVerification.id, socket.id);
    socket.emit(CLIENT_EVENTS.AUTHORIZED, {[EVENT_NAME]: SERVER_EVENTS.CONNECTION, data: tokenVerification.id });
  } catch (err) {
    socket.emit(CLIENT_EVENTS.UNAUTHORIZED, { [EVENT_NAME]: UNAUTHORIZED_ERROR });
  }

  socket.on(SERVER_EVENTS.CONNECT_FRIEND, (friendId: string, data: unknown) => {
    const friendSocketId = users.get(friendId);
    if (friendSocketId) {
      socket.to(friendSocketId).emit(CLIENT_EVENTS.ERRORS, { [EVENT_NAME]: SERVER_EVENTS.CONNECT_FRIEND });
    } else {
      socket.emit(CLIENT_EVENTS.ERRORS, { [EVENT_NAME]: SERVER_EVENTS.CONNECT_FRIEND, data: {isOnline: false} });
    }
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Listening at: http://localhost:${PORT}`);
});
