import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { config } from "dotenv";
import { CLIENT_EVENTS, SERVER_EVENTS } from "./constants/events";
import { EVENT_NAME } from "./constants/constants";
import { ChatMessageData, SocketInstance } from "./types";
import { verifyAuth } from "./middleware/authVerification";
import { idValidation, messageValidation } from "./validation";
import { concatProps } from "./utils/concatProp";

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [...process.env.ALLOW_FRONTENDS!.split(",")],
  },
});

io.use(verifyAuth());

const users = new Map();

io.on(SERVER_EVENTS.CONNECTION, (socket: SocketInstance) => {
  users.set(socket.userId, socket.id);

  socket.on(
    SERVER_EVENTS.CONNECT_FRIEND,
    (data: Record<"friendId", string>, callback: CallableFunction) => {
      const validation = idValidation("friendId").validate(data);
      if (validation.error) {
        const errors = concatProps(validation.error.details, "message");
        callback({ status: "failed", error: errors });
        return;
      }
      const { friendId } = data;
      const friendSocketId = users.get(friendId);
      callback({ status: "ok" });

      if (friendSocketId) {
        socket.to(friendSocketId).emit(CLIENT_EVENTS.NOTIFICATION, {
          [EVENT_NAME]: SERVER_EVENTS.CONNECT_FRIEND,
        });
      }
    }
  );

  socket.on(
    SERVER_EVENTS.CHAT_MESSAGE,
    (data: ChatMessageData, callback: CallableFunction) => {
      data;
      const validation = messageValidation.validate(data);
      if (validation.error) {
        const errors = concatProps(validation.error.details, "message");
        callback({ status: "failed", error: errors });
        return;
      }
      const correspondingUsers = data.recipientId
        .map((userId) => users.get(userId))
        .filter(Boolean);
      correspondingUsers;
      if (correspondingUsers.length === 0) return;
      socket.to(correspondingUsers).emit(CLIENT_EVENTS.CHAT_MESSAGE_RECEIVER, {
        [EVENT_NAME]: SERVER_EVENTS.CHAT_MESSAGE,
        message: data.message,
        creatorId: data.creatorId,
      });
      callback({ status: "ok" });
    }
  );

  socket.on("disconnect", () => {
    socket.userId;
    users.delete(socket.userId);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Listening at: ${process.env.LOCAL_SERVER}:${PORT}`);
});
