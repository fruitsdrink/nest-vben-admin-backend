import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '登录用户不能为空' })
  username: string;
  @IsNotEmpty({ message: '登录密码不能为空' })
  password: string;
}
