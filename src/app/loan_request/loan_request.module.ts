import { Module } from '@nestjs/common';
import { LoanRequestController } from './loan_request.controller';
import { LoanRequestService } from './loan_request.service';

@Module({
  imports: [],
  controllers: [LoanRequestController],
  providers: [LoanRequestService],
})
export class LoanRequestModule {}
