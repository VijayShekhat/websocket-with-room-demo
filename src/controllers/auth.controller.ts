import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AuthService } from 'src/services/auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login route to authenticate user and return a JWT token
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(createUserDto);
    if (!user) {
      throw new Error('Invalid Inputs');
    }
    return (user);
  }

  // Example of a protected route
  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getProtected() {
    return { message: 'This is a protected route!' };
  }
}
