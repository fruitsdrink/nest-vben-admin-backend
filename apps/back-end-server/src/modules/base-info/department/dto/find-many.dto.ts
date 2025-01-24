import { IsOptional, IsString } from 'class-validator';

export class FindManyDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
