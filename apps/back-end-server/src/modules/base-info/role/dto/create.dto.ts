import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  @IsNotEmpty({ message: '有效状态不能为空' })
  @IsIn([0, 1], { message: '有效状态只能是0或1' })
  status?: 0 | 1;

  @IsOptional()
  remark?: string;

  @IsOptional()
  @IsNumber({}, { message: '排序编号必须是数字' })
  sort?: number;
}
