import { Module } from '@nestjs/common';
import { LoanRequestController } from './loan_request.controller';
import { LoanRequestService } from './loan_request.service';
import { ZaloPayService } from 'src/core/services/payment/zalopay.service';
import { BankCardService } from '../bank_card/bank_card.service';
import { BankCardModule } from '../bank_card/bank_card.module';

@Module({
  imports: [BankCardModule],
  controllers: [LoanRequestController],
  providers: [LoanRequestService],
})
export class LoanRequestModule {}
