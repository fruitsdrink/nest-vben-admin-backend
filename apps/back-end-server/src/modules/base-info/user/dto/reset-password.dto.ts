import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: number;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
