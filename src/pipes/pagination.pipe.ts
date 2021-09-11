import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class Pagination {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit = 10;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page = 1;
}
