import { verify } from "jsonwebtoken";
import { SocketInstance } from "../types";
import { ExtendedError } from "socket.io";

export const verifyAuth = () => {
  return (socket: SocketInstance, next: (err?: ExtendedError) => void) => {
    const token =
      socket?.handshake?.auth?.token || socket.handshake.query.token;
    if (!token) return next(new Error("Auth error: no token provided"));
    try {
      const tokenVerification = verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      socket.userId = tokenVerification.id;
      next();
    } catch (err) {
      return next(new Error("Auth error:" + (err as Error).message));
    }
  };
};
