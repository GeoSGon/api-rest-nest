import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req) {
    const result = await this.authService.login(req.user);

    if (!result) {
      throw new HttpException('Login invalid', HttpStatus.UNAUTHORIZED);
    }

    return result;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);

    if (!result) {
      throw new HttpException('Register invalid', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const result = this.authService.refreshToken(req.user);

    if (!result) {
      throw new HttpException('Refresh token invalid', HttpStatus.UNAUTHORIZED);
    }

    return result;
  }
}
