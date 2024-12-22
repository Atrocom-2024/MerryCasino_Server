import { Socket } from "socket.io";

export const emitSuccess = (socket: Socket, event: string, response: object) => {
  socket.emit(event, response);
};

export const emitError = (socket: Socket, event: string, status: number, message: string) => {
  socket.emit(event, { status, message: `[socket] ${message}` });
};

export const handleError = (socket: Socket, error: any, event: string) => {
  console.error(`[socket] Error in ${event}:`, error);
  socket.emit(event, {
    status: 500,
    message: "An unexpected error occurred.",
  });
};
