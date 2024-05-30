import { Module } from '@nestjs/common';
import { BankCardService } from './bank_card.service';
import { BankCardController } from './bank_card.controller';

@Module({
  providers: [BankCardService],
  controllers: [BankCardController],
  exports: [BankCardService],
})
export class BankCardModule {}
