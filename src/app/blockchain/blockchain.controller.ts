import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { CreateLoanContractDTO } from './dto';

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('create-loan-contract')
  async createLoanContract(
    @Body() createLoanContractDTO: CreateLoanContractDTO,
  ) {
    const res = await this.blockchainService.addLoanContract(
      createLoanContractDTO,
    );
    return res;
  }

  @Get('get-all-loan-contracts')
  async getAllLoanContracts() {
    return await this.blockchainService.getAllLoanContracts();
  }

  @Get('get-loan-contract/:loanId')
  async getLoanContract(@Param('loanId') loanId: string) {
    return await this.blockchainService.getLoanContractById(loanId);
  }

  @Post('approve-loan-contract/:loanId')
  async approveLoanContract(@Param('loanId') loanId: string) {
    return await this.blockchainService.approveLoanContract(loanId);
  }

  @Post('reject-loan-contract/:loanId')
  async rejectLoanContract(@Param('loanId') loanId: string) {
    return await this.blockchainService.rejectLoanContract(loanId);
  }

  @Post('activate-loan-contract/:loanId')
  async activateLoanContract(@Param('loanId') loanId: string) {
    return await this.blockchainService.activateLoanContract(loanId);
  }
}
