import { IsOptional, IsString } from 'class-validator';

export class FindRoleManyDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
