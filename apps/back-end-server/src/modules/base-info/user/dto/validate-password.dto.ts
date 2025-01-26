import { IsNotEmpty } from 'class-validator';

export class ValidatePasswordDto {
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
