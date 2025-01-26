import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindUserListDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString({}, { message: '页码必须是数字' })
  status?: string;

  @IsOptional()
  @IsNumberString({}, { message: '部门ID必须是数字' })
  departmentId?: number;
}
