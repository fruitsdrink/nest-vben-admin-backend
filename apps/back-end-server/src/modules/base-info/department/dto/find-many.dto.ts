import { IsOptional, IsString } from 'class-validator';

export class FindDepartmentManyDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
