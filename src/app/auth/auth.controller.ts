import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import cookie from 'cookie';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import {
  AlreadyExistsError,
  InvalidCredentialsError,
} from 'src/utils/base/errors';
import { Response } from 'express';
import { JwtExpiry } from 'src/jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.NO_CONTENT)
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
          maxAge: JwtExpiry.REFRESH_TOKEN_EXPIRY,
        }),
        cookie.serialize('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: JwtExpiry.REFRESH_TOKEN_EXPIRY,
        }),
      ]);
      return;
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED, {
          cause: error,
        });
      }
    }
  }

  @Post('/signup')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signup(@Body() data: SignupDto) {
    try {
      await this.authService.signup(data);
      return;
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT, {
          cause: error,
        });
      }
    }
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    return;
  }
}
