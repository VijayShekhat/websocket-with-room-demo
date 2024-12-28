// src/types/socket.d.ts
import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user: any;  // You can replace 'any' with a more specific type, like JwtPayload
  }
}
