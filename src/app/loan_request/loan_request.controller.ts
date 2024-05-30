import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CreateLoanRequestDto from './dtos/loan_request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId, GetParamId } from 'src/common/decorators';
import { LoanRequestService } from './loan_request.service';
import {
  LoanRequestQueryBuilderDirector,
  LoanRequestQueryPayload,
} from './query/loan_request_query';

@Controller('loan-request')
@ApiTags('Loan Request')
@ApiBearerAuth()
export class LoanRequestController {
  constructor(private readonly loanRequestService: LoanRequestService) {}

  @Post()
  async createLoanRequest(
    @Body() data: CreateLoanRequestDto,
    @GetCurrentUserId() userId: string,
  ) {
    return await this.loanRequestService.createLoanRequest(userId, data);
  }

  @Get('sent')
  async getSentLoanRequests(
    @GetCurrentUserId() userId: string,
    @Query() query: LoanRequestQueryPayload,
  ) {
    const director = new LoanRequestQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanRequestService.getSentLoanRequests(
      userId,
      queryBuilder,
    );
  }

  @Get('received')
  async getReceivedLoanRequests(
    @GetCurrentUserId() userId: string,
    @Query() query: LoanRequestQueryPayload,
  ) {
    const director = new LoanRequestQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanRequestService.getReceivedLoanRequests(
      userId,
      queryBuilder,
    );
  }

  @Post(':id/approve')
  async approveLoanRequest(
    @GetCurrentUserId() userId: string,
    @GetParamId() id: string,
  ) {
    await this.loanRequestService.approveLoanRequest(userId, id);
  }

  @Post(':id/reject')
  async rejectLoanRequest(
    @GetCurrentUserId() userId: string,
    @GetParamId() id: string,
  ) {
    return await this.loanRequestService.rejectLoanRequest(userId, id);
  }

  @Post(':id/cancel')
  async cancelLoanRequest(
    @GetCurrentUserId() userId: string,
    @GetParamId() id: string,
  ) {
    return await this.loanRequestService.cancelLoanRequest(userId, id);
  }

  // Thanh thoán lệ phí vay
  @Post(':id/pay')
  async payLoanRequest(
    @GetCurrentUserId() userId: string,
    @GetParamId() id: string,
  ) {
    return await this.loanRequestService.payLoanRequest(userId, id);
  }
}
