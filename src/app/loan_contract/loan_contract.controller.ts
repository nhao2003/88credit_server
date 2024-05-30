import { Controller, Get, Query } from '@nestjs/common';
import { LoanContract } from '@prisma/client';
import Paging from 'src/common/types/paging.type';
import { LoanContractService } from './loan_contract.service';
import {
  LoanContractQuery,
  LoanContractQueryBuilderDirector,
  LoanContractQueryPayload,
} from './query/loan_contract.query';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('loan-contract')
export class LoanContractController {
  constructor(private readonly loanContractService: LoanContractService) {}

  @Get('borrow')
  async getBorrowLoanContracts(
    @GetCurrentUserId() userId: string,
    @Query() query: LoanContractQueryPayload,
  ): Promise<Paging<LoanContract>> {
    const director = new LoanContractQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanContractService.getBorrowerLoanContracts(
      userId,
      queryBuilder,
    );
  }

  @Get('lend')
  async getLendLoanContracts(
    @GetCurrentUserId() userId: string,
    @Query() query: LoanContractQueryPayload,
  ): Promise<Paging<LoanContract>> {
    const director = new LoanContractQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanContractService.getLenderLoanContracts(
      userId,
      queryBuilder,
    );
  }
}
