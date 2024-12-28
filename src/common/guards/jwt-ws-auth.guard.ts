import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';  // Import jsonwebtoken library
import { AuthService } from 'src/services/auth.service';  // Import your AuthService
import { Observable } from 'rxjs';

@Injectable()
export class JwtWsGuard {
  constructor(private readonly authService: AuthService) {}

  // Make the canActivate method async to await the JWT verification
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();  // Access the WebSocket client

    // Extract token from the query
    const token = this.extractTokenFromQuery(client);  
    if (!token) {
      throw new WsException('Authorization token missing');
    }

    try {
      // Verify the token and decode it asynchronously
      const decoded = await this.authService.verifyJwt(token);
      if (!decoded) {
        throw new WsException('Invalid or expired token');
      }

      // Attach decoded user info to the WebSocket client
      client.user = decoded;
      return true;  // Allow the connection
    } catch (error) {
      throw new WsException('Invalid or expired token');
    }
  }

  private extractTokenFromQuery(client: any): string | null {
    // Get the token from the query string
    const token = client.handshake.query.token;
    if (!token) {
      console.log('Token is missing in query');
      return null;
    }
    return token;
  }
}
