import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateLoanRequestDto {
  @ApiProperty({
    title: 'Loan request title',
    description: 'Loan request title',
    required: true,
    maxLength: 255,
    example: 'I need a loan',
  })
  @IsString()
  description: string;

  @ApiProperty({
    title: 'Receiver id',
    description: 'Receiver id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  receiverId: string;

  @ApiProperty({
    title: 'Loan amount',
    description: 'Loan amount',
    required: true,
    example: 1000,
  })
  @IsNumber()
  loanAmount: number;

  @ApiProperty({
    title: 'Interest rate',
    description: 'Interest rate',
    required: true,
    example: 0.1,
  })
  @IsNumber()
  interestRate: number;

  @ApiProperty({
    title: 'Overdue interest rate',
    description: 'Overdue interest rate',
    required: true,
    example: 0.1,
  })
  @IsNumber()
  overdueInterestRate: number;

  @ApiProperty({
    title: 'Loan tenure months',
    description: 'Loan tenure months',
    required: true,
    example: 12,
  })
  @IsNumber()
  loanTenureMonths: number;

  @ApiProperty({
    title: 'Loan reason type',
    description: 'Loan reason type',
    required: true,
    enum: $Enums.LoanReasonTypes,
  })
  @IsString()
  loanReasonType: $Enums.LoanReasonTypes;

  @ApiProperty({
    title: 'Loan reason',
    description: 'Loan reason',
    required: true,
    maxLength: 255,
    example: 'I need money to buy a new phone',
  })
  @IsString()
  @MaxLength(255)
  loanReason: string;

  @ApiProperty({
    title: 'Video confirmation url',
    description: 'Video confirmation url',
    required: true,
    example:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  })
  @IsUrl()
  videoConfirmationUrl: string;

  @ApiProperty({
    title: 'Portrait photo url',
    description: 'Portrait photo url',
    required: true,
    example: 'https://picsum.photos/200/300?random=1',
  })
  @IsUrl()
  portaitPhotoUrl: string;

  @ApiProperty({
    title: 'ID card front photo url',
    description: 'ID card front photo url',
    required: true,
    example: 'https://picsum.photos/200/300?random=2',
  })
  @IsUrl()
  idCardFrontPhotoUrl: string;

  @ApiProperty({
    title: 'ID card back photo url',
    description: 'ID card back photo url',
    required: true,
    example: 'https://picsum.photos/200/300?random=3',
  })
  @IsUrl()
  idCardBackPhotoUrl: string;

  @ApiProperty({
    title: 'Sender bank card id',
    description: 'Sender bank card id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  senderBankCardId: string;
}

export default CreateLoanRequestDto;
