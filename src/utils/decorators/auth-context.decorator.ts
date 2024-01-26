import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithAuthContext } from 'src/middleware/auth.middleware';

export const AuthContextDec = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<RequestWithAuthContext>();
    return req.authContext;
  },
);
