import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindUserManyDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString({}, { message: '部门ID必须是数字' })
  departmentId?: string;
}
