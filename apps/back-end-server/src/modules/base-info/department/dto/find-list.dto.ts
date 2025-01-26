import { IsOptional, IsString } from 'class-validator';

export class FindListDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
