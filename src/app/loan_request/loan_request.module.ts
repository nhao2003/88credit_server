import { Module } from '@nestjs/common';
import { LoanRequestController } from './loan_request.controller';
import { LoanRequestService } from './loan_request.service';
import { BankCardModule } from '../bank_card/bank_card.module';

@Module({
  imports: [BankCardModule],
  controllers: [LoanRequestController],
  providers: [LoanRequestService],
})
export class LoanRequestModule {}
