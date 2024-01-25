import bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import {
  AlreadyExistsError,
  InvalidCredentialsError,
} from 'src/utils/base/errors';
import { randomUUID } from 'crypto';
import { JwtService } from 'src/jwt/jwt.service';
import { RedisPrefix, RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DrizzleClient')
    private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    if (!user) throw new InvalidCredentialsError('Invalid Credentials');

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new InvalidCredentialsError('Invalid Credentials');

    const authToken = this.jwtService.createAuthToken(user.id);
    const refreshToken = this.jwtService.createRefreshToken(authToken);
    await this.redisService.set(
      RedisPrefix.RefreshToken,
      user.id,
      refreshToken,
    );

    return {
      authToken,
      refreshToken,
    };
  }

  async signup(data: SignupDto) {
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existingUser) {
      throw new AlreadyExistsError('User account already exists, please login');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    await this.db.insert(users).values({
      id: randomUUID(),
      email: data.email,
      password: hashPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    return;
  }
}
