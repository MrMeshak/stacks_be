import { Injectable } from '@nestjs/common';
import jwt, { ITokenPayload, VerifyOptions } from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface ITokenPayload extends jwt.JwtPayload {
    sub: string;
    iat: number;
    exp: number;
  }
}

export enum JwtExpiry {
  AUTH_TOKEN_EXPIRY = 60 * 15, //15 mins
  REFRESH_TOKEN_EXPIRY = 60 * 1440, // 24 hours -> 1440 mins
}

@Injectable()
export class JwtService {
  createAuthToken(id: string) {
    return jwt.sign({ sub: id }, process.env.AUTH_TOKEN_SECRET, {
      expiresIn: JwtExpiry.AUTH_TOKEN_EXPIRY,
    });
  }

  createRefreshToken(id: string) {
    return jwt.sign({ sub: id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: JwtExpiry.REFRESH_TOKEN_EXPIRY,
    });
  }

  verifyAuthToken(token: string, options?: VerifyOptions) {
    return jwt.verify(
      token,
      process.env.AUTH_TOKEN_SECRET,
      options,
    ) as ITokenPayload;
  }

  verifyRefreshToken(token: string, options?: VerifyOptions) {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      options,
    ) as ITokenPayload;
  }
}
