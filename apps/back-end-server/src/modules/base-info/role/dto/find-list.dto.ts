import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindListDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString()
  status?: string;
}
