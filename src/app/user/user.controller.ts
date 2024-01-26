import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthContext } from 'src/middleware/auth.middleware';
import { AuthContextDec } from 'src/utils/decorators/auth-context.decorator';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async me(@AuthContextDec() authContext: AuthContext) {
    const user = await this.userService.findUserById(authContext.userId);
    if (!user) {
      throw new NotFoundException('User could not be found');
    }
    return plainToInstance(UserResponseDto, user);
  }
}
