import { Response } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { UserStatus } from '../../drizzle/schema';
import {
  AuthMiddleware,
  AuthStatus,
  RequestWithAuthContext,
} from '../auth.middleware';
import { mockDeep } from 'jest-mock-extended';
import { JwtExpiry, JwtService } from '../../jwt/jwt.service';
import { RedisPrefix, RedisService } from '../../redis/redis.service';

describe('middleware - auth.middleware', () => {
  const req = mockDeep<RequestWithAuthContext>();
  const res = mockDeep<Response>();

  const mockJwtService = mockDeep<JwtService>();
  const mockRedisService = mockDeep<RedisService>();
  const mockDb = mockDeep<PostgresJsDatabase<typeof schema>>();

  const mockNext = jest.fn();

  const authMiddleware: AuthMiddleware = new AuthMiddleware(
    mockDb,
    mockJwtService,
    mockRedisService,
  );

  beforeEach(async () => {
    jest.clearAllMocks();

    // const moduleRef = await Test.createTestingModule({
    //   providers: [JwtService, RedisService, drizzleProvider],
    // })

    //   .overrideProvider(JwtService)
    //   .useValue(mockJwtService)
    //   .overrideProvider(RedisService)
    //   .useValue(mockRedisService)
    //   .overrideProvider('DrizzleClient')
    //   .useFactory({ factory: () => mockDb })
    //   .compile();

    // const jwtService = moduleRef.get<DeepMockProxy<JwtService>>(JwtService);
    // const redisService =
    //   moduleRef.get<DeepMockProxy<RedisService>>(RedisService);
    // const db =
    //   moduleRef.get<DeepMockProxy<PostgresJsDatabase<typeof schema>>>(
    //     'DrizzleClient',
    //   );
  });

  describe('when the req does not contain authToken or refreshToken', () => {
    it('should set authContext = {userId: undefined, authStatus: MISSING_TOKEN, setNewTokens: false}', async () => {
      req.headers.cookie = '';

      await authMiddleware.use(req, res, mockNext);

      expect(req.authContext).toMatchObject({
        userId: undefined,
        authStatus: AuthStatus.MISSING_TOKEN,
        setNewTokens: false,
      });
    });
  });

  describe('when the authToken is invalid or expired', () => {
    it('should set authContext = {userId: undefined, authStatus: INVALID_AUTH_TOKEN, setNewTokens: false} ', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';

      mockJwtService.verifyAuthToken.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await authMiddleware.use(req, res, mockNext);

      expect(req.authContext).toMatchObject({
        userId: undefined,
        authStatus: AuthStatus.INVALID_AUTH_TOKEN,
        setNewTokens: false,
      });
    });
  });

  describe('when the authToken is valid and not expired', () => {
    it('should set authContext = { userId: userId, authStatus: AUTHENTICATED, setNewTokens: false}', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';

      mockJwtService.verifyAuthToken.mockReturnValue({
        sub: 'userId',
        exp: Date.now() / 1000 + JwtExpiry.AUTH_TOKEN_EXPIRY,
        iat: Date.now() / 1000,
      });

      await authMiddleware.use(req, res, mockNext);

      expect(req.authContext).toMatchObject({
        userId: 'userId',
        authStatus: AuthStatus.AUTHENTICATED,
        setNewTokens: false,
      });
    });
  });

  describe('when the authToken is valid but has expired and the refreshToken is invalid or expired', () => {
    it('should set authContext = { userId: undefined, authStatus: INVALID_REFRESH_TOKEN, setNewTokens: false}', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';
      mockJwtService.verifyAuthToken.mockReturnValue({
        sub: 'userId',
        exp: Date.now() / 1000 - JwtExpiry.AUTH_TOKEN_EXPIRY,
        iat: Date.now() / 1000 - JwtExpiry.REFRESH_TOKEN_EXPIRY,
      });
      mockJwtService.verifyRefreshToken.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await authMiddleware.use(req, res, mockNext);

      expect(req.authContext).toMatchObject({
        userId: undefined,
        authStatus: AuthStatus.INVALID_REFRESH_TOKEN,
        setNewTokens: false,
      });
    });
  });

  describe('when the authToken is valid but has expired, the refreshToken is valid but authToken and refreshToken have mismatch', () => {
    it('should set authContext = { userId: undefined, authStatus: AUTH_REFRESH_MISMATCH, setNewTokens: false}', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';
      mockJwtService.verifyAuthToken.mockReturnValue({
        sub: 'userId',
        exp: Date.now() / 1000 - JwtExpiry.AUTH_TOKEN_EXPIRY,
        iat: Date.now() / 1000 - JwtExpiry.REFRESH_TOKEN_EXPIRY,
      });
      mockJwtService.verifyRefreshToken.mockReturnValue({
        sub: 'differentTokenString',
        exp: Date.now() / 1000 + JwtExpiry.REFRESH_TOKEN_EXPIRY,
        iat: Date.now() / 1000,
      });

      await authMiddleware.use(req, res, mockNext);

      expect(req.authContext).toMatchObject({
        userId: undefined,
        authStatus: AuthStatus.AUTH_REFRESH_MISMATCH,
        setNewTokens: false,
      });
    });
  });

  describe('when the authToken is valid but has expired, the refreshToken is valid but does not match storedRefreshToken (i.e the refresh token has already been used)', () => {
    it('should delete storedRefreshToken and set authContext = {userId: undefined, authStatus: REFRESH_TOKEN_REUSED, setNewTokens: false}', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';
      mockJwtService.verifyAuthToken.mockReturnValue({
        sub: 'userId',
        exp: Date.now() / 1000 - JwtExpiry.AUTH_TOKEN_EXPIRY,
        iat: Date.now() / 1000 - JwtExpiry.REFRESH_TOKEN_EXPIRY,
      });
      mockJwtService.verifyRefreshToken.mockReturnValue({
        sub: 'authToken',
        exp: Date.now() / 1000 + JwtExpiry.REFRESH_TOKEN_EXPIRY,
        iat: Date.now() / 1000,
      });

      mockRedisService.get.mockResolvedValue('storedRefreshToken');

      await authMiddleware.use(req, res, mockNext);

      expect(mockRedisService.delete).toHaveBeenCalledWith(
        RedisPrefix.RefreshToken,
        'userId',
      );
      expect(req.authContext).toMatchObject({
        userId: undefined,
        authStatus: AuthStatus.REFRESH_TOKEN_REUSED,
        setNewTokens: false,
      });
    });
  });

  describe('when the authToken is valid but has expired, the refreshToken is valid and matches storedRefreshToken but the user does not exist in db', () => {
    it('should set authContext = {userId: undefined, authStatus: USER_NOT_FOUND, setNewTokens: false}', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';
      mockJwtService.verifyAuthToken.mockReturnValue({
        sub: 'userId',
        exp: Date.now() / 1000 - JwtExpiry.AUTH_TOKEN_EXPIRY,
        iat: Date.now() / 1000 - JwtExpiry.REFRESH_TOKEN_EXPIRY,
      });
      mockJwtService.verifyRefreshToken.mockReturnValue({
        sub: 'authToken',
        exp: Date.now() / 1000 + JwtExpiry.REFRESH_TOKEN_EXPIRY,
        iat: Date.now() / 1000,
      });

      mockRedisService.get.mockResolvedValue('refreshToken');
      mockDb.query.users.findFirst.mockResolvedValue(null);

      await authMiddleware.use(req, res, mockNext);

      expect(req.authContext).toMatchObject({
        userId: undefined,
        authStatus: AuthStatus.USER_NOT_FOUND,
        setNewTokens: false,
      });
    });
  });

  describe('when authToken is valid but has expired, the refreshToken is valid and matches storedRefreshToken but the user is suspended', () => {
    it('should set authContext = {userId: undefined, authStatus: USER_SUSPENDED, setNewTokens: false}', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';
      mockJwtService.verifyAuthToken.mockReturnValue({
        sub: 'userId',
        exp: Date.now() / 1000 - JwtExpiry.AUTH_TOKEN_EXPIRY,
        iat: Date.now() / 1000 - JwtExpiry.REFRESH_TOKEN_EXPIRY,
      });
      mockJwtService.verifyRefreshToken.mockReturnValue({
        sub: 'authToken',
        exp: Date.now() / 1000 + JwtExpiry.REFRESH_TOKEN_EXPIRY,
        iat: Date.now() / 1000,
      });

      mockRedisService.get.mockResolvedValue('refreshToken');
      mockDb.query.users.findFirst.mockResolvedValue({
        userStatus: UserStatus.SUSPENDED,
      } as any);

      await authMiddleware.use(req, res, mockNext);

      expect(req.authContext).toMatchObject({
        userId: undefined,
        authStatus: AuthStatus.USER_SUSPENDED,
        setNewTokens: false,
      });
    });
  });

  describe('when authToken is valid but has expired, the refreshToken is valid and matches storedRefreshToken and the user exists and is not suspended', () => {
    it('should set new auth and refresh tokens on the response and set the authContext = {userId: userId, authStatus: AUTHENTICATED, setNewTokens: true}', async () => {
      req.headers.cookie = 'authToken=authToken;refreshToken=refreshToken;';
      mockJwtService.verifyAuthToken.mockReturnValue({
        sub: 'userId',
        exp: Date.now() / 1000 - JwtExpiry.AUTH_TOKEN_EXPIRY,
        iat: Date.now() / 1000 - JwtExpiry.REFRESH_TOKEN_EXPIRY,
      });
      mockJwtService.verifyRefreshToken.mockReturnValue({
        sub: 'authToken',
        exp: Date.now() / 1000 + JwtExpiry.REFRESH_TOKEN_EXPIRY,
        iat: Date.now() / 1000,
      });

      mockRedisService.get.mockResolvedValue('refreshToken');
      mockDb.query.users.findFirst.mockResolvedValue({
        userStatus: UserStatus.ACTIVE,
      } as any);

      mockJwtService.createAuthToken.mockReturnValue('newAuthToken');
      mockJwtService.createRefreshToken.mockReturnValue('newRefreshToken');

      await authMiddleware.use(req, res, mockNext);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.arrayContaining([
          expect.stringContaining('authToken=newAuthToken'),
          expect.stringContaining('refreshToken=newRefreshToken'),
        ]),
      );
      expect(mockRedisService.set).toHaveBeenCalledWith(
        RedisPrefix.RefreshToken,
        'userId',
        'newRefreshToken',
      );
      expect(req.authContext).toMatchObject({
        userId: 'userId',
        authStatus: AuthStatus.AUTHENTICATED,
        setNewTokens: true,
      });
    });
  });
});
