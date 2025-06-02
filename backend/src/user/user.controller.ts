import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return {
      message: 'Usuário autenticado!',
      user: req.user,
    };
  }
}
