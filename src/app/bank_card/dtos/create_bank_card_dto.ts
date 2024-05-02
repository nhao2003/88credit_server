import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

class CreateBankCardDto {
  @ApiProperty({
    title: 'Bank code',
    description: 'Bank code',
  })
  @IsString()
  bankCode: string;

  @ApiProperty({
    title: 'Card number',
    description: 'Card number (16 digits)',
  })
  @IsNumberString()
  cardNumber: string;

  @ApiProperty({
    title: 'Card holder',
    description: 'Card holder',
    required: false,
  })
  @IsString()
  @IsOptional()
  brand: string | null;
}

export default CreateBankCardDto;
