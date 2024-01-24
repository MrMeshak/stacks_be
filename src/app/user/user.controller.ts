import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/me')
  getMe() {
    return 'user data';
  }
}
