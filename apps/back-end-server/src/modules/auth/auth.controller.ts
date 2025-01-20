import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  login() {
    return this.service.login();
  }
}
