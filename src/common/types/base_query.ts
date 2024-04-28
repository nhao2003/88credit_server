import { IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator';

class BaseQuery {
  @IsOptional()
  @IsDecimal()
  page?: number;

  @IsOptional()
  @IsDecimal()
  take?: number;

  @IsOptional()
  @IsString()
  orderBy?: string | null;
}

export default BaseQuery;
