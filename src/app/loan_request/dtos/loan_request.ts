import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoanRequest {
  status: $Enums.LoanContractRequestStatus;
  sender_id: string;
  receiver_id: string;
  description: string;
  loan_amount: number;
  interest_rate: number;
  overdue_interest_rate: number;
  loan_tenure_months: number;
  loan_reason_type: string;
  loan_reason: string;
  video_confirmation: string;
  portait_photo: string;
  id_card_front_photo: string;
  id_card_back_photo: string;
  sender_bank_card_id: string;
  receiver_bank_card_id: string;
  rejected_reason: string | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
