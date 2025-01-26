import { IsOptional, IsString } from 'class-validator';

export class FindDepartmentListDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
