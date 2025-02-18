"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const dotenv_1 = require("dotenv");
const events_1 = require("./constants/events");
const constants_1 = require("./constants/constants");
const authVerification_1 = require("./middleware/authVerification");
const validation_1 = require("./validation");
const concatProp_1 = require("./utils/concatProp");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const httpServer = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: [...process.env.ALLOW_FRONTENDS.split(",")],
    },
});
io.use((0, authVerification_1.verifyAuth)());
const users = new Map();
io.on(events_1.SERVER_EVENTS.CONNECTION, (socket) => {
    users.set(socket.userId, socket.id);
    socket.on(events_1.SERVER_EVENTS.CONNECT_FRIEND, (data, callback) => {
        const validation = (0, validation_1.idValidation)("friendId").validate(data);
        if (validation.error) {
            const errors = (0, concatProp_1.concatProps)(validation.error.details, "message");
            callback({ status: "failed", error: errors });
            return;
        }
        const { friendId } = data;
        const friendSocketId = users.get(friendId);
        callback({ status: "ok" });
        if (friendSocketId) {
            socket.to(friendSocketId).emit(events_1.CLIENT_EVENTS.NOTIFICATION, {
                [constants_1.EVENT_NAME]: events_1.SERVER_EVENTS.CONNECT_FRIEND,
            });
        }
    });
    socket.on(events_1.SERVER_EVENTS.CHAT_MESSAGE, (data, callback) => {
        data;
        const validation = validation_1.messageValidation.validate(data);
        if (validation.error) {
            const errors = (0, concatProp_1.concatProps)(validation.error.details, "message");
            callback({ status: "failed", error: errors });
            return;
        }
        const correspondingUsers = data.recipientId
            .map((userId) => users.get(userId))
            .filter(Boolean);
        correspondingUsers;
        if (correspondingUsers.length === 0)
            return;
        socket.to(correspondingUsers).emit(events_1.CLIENT_EVENTS.CHAT_MESSAGE_RECEIVER, {
            [constants_1.EVENT_NAME]: events_1.SERVER_EVENTS.CHAT_MESSAGE,
            message: data.message,
            creatorId: data.creatorId,
        });
        callback({ status: "ok" });
    });
    socket.on("disconnect", () => {
        socket.userId;
        users.delete(socket.userId);
    });
});
const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Listening at: ${process.env.LOCAL_SERVER}:${PORT}`);
});
