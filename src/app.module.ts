import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { UserRepository } from './repositories/user.repository';
import { OrderRepository } from './repositories/order.repository';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderGateway } from './socket/order.gateway';
import { JwtWsGuard } from './common/guards/jwt-ws-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Change this to your PostgreSQL host
      port: 5432, // Default PostgreSQL port
      username: 'postgres', // Replace with your database username
      password: 'vijay', // Replace with your database password
      database: 'websocketdemo', // Replace with your database name
      entities: [User, Order], // Add your entities here
      synchronize: true, // Set to false in production for data integrity
    }),
    TypeOrmModule.forFeature([
      User,
      Order
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key',  // Replace with a strong secret
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AppController, AuthController, OrderController],
  providers: [UserRepository, OrderRepository, AppService, AuthService, OrderService, JwtStrategy, JwtAuthGuard, JwtWsGuard, OrderGateway],
})
export class AppModule {}
