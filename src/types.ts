import { Socket } from "socket.io";

export interface SocketInstance extends Socket {
  userId?: string;
}

export type ChatMessageData = {
  creatorId: string;
  message: string;
  recipientId: Array<string>;
};
