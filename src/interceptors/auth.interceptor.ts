import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import cookie from 'cookie';
import { JwtExpiry } from 'src/jwt/jwt.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const req = context.switchToHttp().getRequest();
        this.logger.log('AuthInterceptor');
        if (req.authContext.setNewTokens) {
          this.logger.log('set newAuthToken and set newRefreshToken');
          res.setHeader('Set-Cookie', [
            cookie.serialize('authToken', req.authContext.newAuthToken || '', {
              httpOnly: true,
              sameSite: 'strict',
              secure: false,
              path: '/',
              maxAge: JwtExpiry.REFRESH_TOKEN_EXPIRY,
            }),
            cookie.serialize(
              'refreshToken',
              req.authContext.newRefreshToken || '',
              {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                path: '/',
                maxAge: JwtExpiry.REFRESH_TOKEN_EXPIRY,
              },
            ),
          ]);
        }
      }),
    );
  }
}
