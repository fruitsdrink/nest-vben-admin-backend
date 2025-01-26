import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindRoleListDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString()
  status?: string;
}
