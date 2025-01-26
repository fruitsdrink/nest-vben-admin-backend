import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsNotEmpty({ message: '昵称不能为空' })
  nickName: string;

  @IsOptional()
  realName?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsNotEmpty({ message: '性别不能为空' })
  @IsIn([0, 1, 2], { message: '性别只能是0、1或2' })
  gender?: 0 | 1 | 2; // 0:未知, 1:男, 2:女

  @IsNotEmpty({ message: '有效状态不能为空' })
  @IsIn([0, 1], { message: '有效状态只能是0或1' })
  status?: 0 | 1;

  @IsOptional()
  remark?: string;

  @IsNotEmpty({ message: '是否是管理员不能为空' })
  @IsIn([0, 1], { message: '是否是管理员只能是0或1' })
  isAdmin: 0 | 1;

  @IsNotEmpty({ message: '排序编号不能为空' })
  @IsNumber({}, { message: '排序编号必须是数字' })
  sort?: number;

  @IsOptional()
  @IsNumber({}, { message: '部门ID必须是数字' })
  departmentId?: number;

  @IsOptional()
  @IsNumber({}, { message: '角色ID必须是数字', each: true })
  roles?: number[];
}
