import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@ApiSchema({
  description: '登录参数',
})
export class LoginDto {
  @ApiProperty({
    required: true,
    description: '登录用户',
    default: '',
  })
  @IsNotEmpty({ message: '登录用户不能为空' })
  username: string;

  @ApiProperty({
    required: true,
    description: '登录密码',
    default: '',
  })
  @IsNotEmpty({ message: '登录密码不能为空' })
  password: string;
}
