import { Module } from '@nestjs/common';
import { LoanRequestController } from './loan_request.controller';
import { LoanRequestService } from './loan_request.service';
import { BankCardModule } from '../bank_card/bank_card.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BankCardModule, BlockchainModule],
  controllers: [LoanRequestController],
  providers: [LoanRequestService],
})
export class LoanRequestModule {}
