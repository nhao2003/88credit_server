import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreatePostDto {
  @ApiProperty({
    description: 'The post type',
  })
  @IsEnum($Enums.PostTypes)
  type: $Enums.PostTypes;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    maxLength: 255,
    description: 'The title of the post',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the post',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The images of the post',
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @ApiProperty({
    enum: $Enums.LoanReasonTypes,
    description: 'The reason for the loan',
  })
  @IsEnum($Enums.LoanReasonTypes)
  @IsNotEmpty()
  loanReason: $Enums.LoanReasonTypes;

  @ApiProperty({
    description: 'The description of the reason for the loan',
  })
  @IsString()
  @IsNotEmpty()
  loanReasonDescription: string;

  @ApiProperty({
    description: 'The purpose of the loan',
  })
  @IsNumber()
  @IsNotEmpty()
  interestRate: number;

  @ApiProperty({
    description: 'The amount of the loan',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'The duration of the loan',
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: 'The overdue interest rate of the loan',
  })
  @IsNumber()
  @IsNotEmpty()
  overdueInterestRate: number;

  @ApiProperty({
    required: false,
    description: 'The maximum amount that can be requested',
  })
  @IsNumber()
  maxInterestRate: number | null;

  @ApiProperty({
    required: false,
    description: 'The maximum amount that can be requested',
  })
  @IsNumber()
  maxAmount: number | null;

  @ApiProperty({
    required: false,
    description: 'The maximum duration of the loan',
  })
  @IsNumber()
  maxDuration: number | null;

  @ApiProperty({
    required: false,
    description: 'The maximum overdue interest rate',
  })
  @IsNumber()
  maxOverdueInterestRate: number | null;
}

class CreatePostWithUserIdDto extends CreatePostDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export { CreatePostDto, CreatePostWithUserIdDto };
