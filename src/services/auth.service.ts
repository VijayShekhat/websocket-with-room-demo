import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import * as jwt from 'jsonwebtoken';  // Import jsonwebtoken
import { JwtPayload } from 'src/common/guards/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private readonly jwtSecret = 'your-secret-key';  // Secret key used for JWT signing

  // Method to verify JWT and return the decoded payload
  async verifyJwt(token: string): Promise<JwtPayload | null> {
    try {
      // Verify the token with the secret key and decode it
      const decoded = await jwt.verify(token, this.jwtSecret) as JwtPayload;
      return decoded;  // Return the decoded payload
    } catch (error) {
      // Handle errors based on the type of error
      if (error instanceof jwt.TokenExpiredError) {
        console.error('Token expired:', error.message);
        return null;  // Token is expired
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.error('Invalid token:', error.message);
        return null;  // Invalid token
      } else {
        console.error('Error during token verification:', error.message);
        return null;  // General error
      }
    }
  }


  // Validate user by username and password
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findByUserName(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  // Generate JWT token
  async login(user: User) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Validate user by ID (used in the JwtStrategy)
  async validateUserById(userId: number): Promise<any> {
    return this.userRepository.findById(userId);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    return this.userRepository.createUser(createUserDto);
  }
}
