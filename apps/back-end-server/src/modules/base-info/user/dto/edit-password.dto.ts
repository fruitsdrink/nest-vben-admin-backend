import { IsNotEmpty } from 'class-validator';

export class EditPasswordDto {
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}
