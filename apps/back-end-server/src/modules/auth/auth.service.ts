import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  login(dto: LoginDto) {
    return {
      isok: true,
      ...dto,
    };
  }
}
