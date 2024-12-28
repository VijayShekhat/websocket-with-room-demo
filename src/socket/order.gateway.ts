import { UseGuards, Request } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard } from 'src/common/guards/jwt-ws-auth.guard';
import { OrderService } from 'src/services/order.service';

@WebSocketGateway({
  cors: {
    origin: '*',  // Allow all origins (you can restrict this if needed)
  },
})
export class OrderGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly orderService: OrderService) {}

  // This method runs when the gateway is initialized
  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  @SubscribeMessage('joinOrder')// When a user joins an order room
  @UseGuards(JwtWsGuard)  // Use custom JWT WebSocket guard here
  async handleJoinOrder(@MessageBody() orderId: number, @ConnectedSocket() socket: Socket) {
    
    const userId = Number(socket.user.sub);  // Access user info attached to the socket object
    const order = await this.orderService.getOrderById(orderId);
    if (order) {
      // Check if the user is allowed to join the room based on the order
      if (order.buyer.id === userId || order.seller.id === userId || order.deliveryBoy.id === userId) {
        socket.join(`order-${orderId}`);  // Join the room based on the order ID
        console.log(`User with ID ${userId} joined room order-${orderId}`);

        // Notify the room that a user has joined
        this.server.to(`order-${orderId}`).emit('userJoined', { userId });
      } else {
        console.log(`User with ID ${userId} is not authorized to join room order-${orderId}`);
        socket.emit('error', 'You are not authorized to join this order room');
      }
    } else {
      socket.emit('error', 'Order not found');
    }
  }

  // Send a message to all users in the order room
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { message: string, orderId: number },  // Expecting both message and orderId
    @ConnectedSocket() socket: Socket,
  ) {
    const { message, orderId } = data;  // Extract the message and orderId

    // Ensure the order exists and the user is authorized to send the message
    const order = await this.orderService.getOrderById(orderId);
    if (order) {
      this.server.to(`order-${orderId}`).emit('newMessage', message);  // Emit to all in the order room
    } else {
      socket.emit('error', 'Order not found');
    }
  }
}
