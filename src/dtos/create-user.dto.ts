// src/user/dto/create-user.dto.ts

import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.BUYER;  // Default role if not provided
}
