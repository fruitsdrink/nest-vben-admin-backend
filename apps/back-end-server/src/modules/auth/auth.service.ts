import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  login(dto: LoginDto) {
    console.log(dto);
    const { username, password } = dto;
    if (username !== 'admin' || password !== 'admin123') {
      throw new ForbiddenException('密码错误');
    }
    return {
      id: 1,
    };
  }
}
