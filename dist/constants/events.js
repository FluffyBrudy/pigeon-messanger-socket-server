"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_EVENTS = exports.SERVER_EVENTS = void 0;
exports.SERVER_EVENTS = {
    CONNECTION: "connection",
    CONNECT_FRIEND: "connect_friend",
    CHAT_MESSAGE: "chat_message",
};
exports.CLIENT_EVENTS = {
    ERRORS: "errors",
    UNAUTHORIZED: "unauthorized",
    AUTHORIZED: "authorize",
    NOTIFICATION: "notification",
    CHAT_MESSAGE_RECEIVER: "chat_message_receiver",
};
