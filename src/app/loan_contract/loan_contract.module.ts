import { Module } from '@nestjs/common';
import { LoanContractController } from './loan_contract.controller';
import { LoanContractService } from './loan_contract.service';

@Module({
  controllers: [LoanContractController],
  providers: [LoanContractService],
})
export class LoanContractModule {}
