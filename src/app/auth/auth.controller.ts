import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import cookie from 'cookie';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { InvalidCredentialsError } from 'src/utils/base/errors';
import { Response } from 'express';
import { JwtExpiry } from 'src/jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { authToken, refreshToken } = await this.authService.login(data);
      res.setHeader('Set-Cookie', [
        cookie.serialize('authToken', authToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: JwtExpiry.AUTH_TOKEN_EXPIRY,
        }),
        cookie.serialize('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: JwtExpiry.REFRESH_TOKEN_EXPIRY,
        }),
      ]);
      return { status: 'success', message: 'login success' };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED, {
          cause: error,
        });
      }
    }
  }

  @Post('/signup')
  async signup(@Body() data: SignupDto) {
    return { signup: 'Signup endpoint' };
  }
}
