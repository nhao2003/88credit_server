import { Controller, Get, Query } from '@nestjs/common';
import { LoanContract } from '@prisma/client';
import Paging from 'src/common/types/paging.type';
import { LoanContractService } from './loan_contract.service';
import {
  LoanContractQuery,
  LoanContractQueryBuilderDirector,
  LoanContractQueryPayload,
} from './query/loan_contract.query';
import { GetCurrentUserId, RpcQuery, RpcUserId } from 'src/common/decorators';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class LoanContractController {
  constructor(private readonly loanContractService: LoanContractService) {}

  @MessagePattern('loan_contract.get_borrow_loan_contracts')
  async getBorrowLoanContracts(
    @RpcUserId() userId: string,
    @RpcQuery() query: LoanContractQueryPayload,
  ): Promise<Paging<LoanContract>> {
    const director = new LoanContractQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanContractService.getBorrowerLoanContracts(
      userId,
      queryBuilder,
    );
  }

  @MessagePattern('loan_contract.get_lend_loan_contracts')
  async getLendLoanContracts(
    @RpcUserId() userId: string,
    @RpcQuery() query: LoanContractQueryPayload,
  ): Promise<Paging<LoanContract>> {
    const director = new LoanContractQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanContractService.getLenderLoanContracts(
      userId,
      queryBuilder,
    );
  }
}
