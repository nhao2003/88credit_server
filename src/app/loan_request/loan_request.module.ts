import { Module } from '@nestjs/common';
import { LoanRequestController } from './loan_request.controller';

@Module({
  imports: [],
  controllers: [LoanRequestController],
  providers: [],
})
export class LoanRequestModule {}
