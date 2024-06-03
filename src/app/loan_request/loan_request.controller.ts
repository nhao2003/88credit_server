import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateLoanRequestDto from './dtos/loan_request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetParamId,
  RpcBody,
  RpcParam,
  RpcQuery,
  RpcUserId,
} from 'src/common/decorators';
import { LoanRequestService } from './loan_request.service';
import {
  LoanRequestQueryBuilderDirector,
  LoanRequestQueryPayload,
} from './query/loan_request_query';
import { MessagePattern } from '@nestjs/microservices';

@Controller('loan-request')
@ApiTags('Loan Request')
@ApiBearerAuth()
export class LoanRequestController {
  constructor(private readonly loanRequestService: LoanRequestService) {}

  @MessagePattern('loan_request.create')
  async createLoanRequest(
    @RpcBody() data: CreateLoanRequestDto,
    @RpcUserId() userId: string,
  ) {
    return await this.loanRequestService.createLoanRequest(userId, data);
  }

  @MessagePattern('loan_request.get_sent_requests')
  async getSentLoanRequests(
    @RpcUserId() userId: string,
    @RpcQuery() query: LoanRequestQueryPayload,
  ) {
    const director = new LoanRequestQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanRequestService.getSentLoanRequests(
      userId,
      queryBuilder,
    );
  }

  @MessagePattern('loan_request.get_received_requests')
  async getReceivedLoanRequests(
    @RpcUserId() userId: string,
    @RpcQuery() query: LoanRequestQueryPayload,
  ) {
    const director = new LoanRequestQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanRequestService.getReceivedLoanRequests(
      userId,
      queryBuilder,
    );
  }

  @MessagePattern('loan_request.approve')
  async approveLoanRequest(
    @RpcUserId() userId: string,
    @RpcParam('id') id: string,
  ) {
    await this.loanRequestService.approveLoanRequest(userId, id);
  }

  @MessagePattern('loan_request.reject')
  async rejectLoanRequest(
    @RpcUserId() userId: string,
    @RpcParam('id') id: string,
  ) {
    return await this.loanRequestService.rejectLoanRequest(userId, id);
  }

  @MessagePattern('loan_request.cancel')
  async cancelLoanRequest(
    @RpcUserId() userId: string,
    @RpcParam('id') id: string,
  ) {
    return await this.loanRequestService.cancelLoanRequest(userId, id);
  }

  // Thanh thoán lệ phí vay
  @MessagePattern('loan_request.pay')
  async payLoanRequest(
    @RpcUserId() userId: string,
    @RpcParam('id') id: string,
  ) {
    return await this.loanRequestService.payLoanRequest(userId, id);
  }

  // Mark lệ phí vay đã thanh toán
  @MessagePattern('loan_request.mark_as_paid')
  async markLoanRequestPaid(@RpcParam('id') id: string) {
    return await this.loanRequestService.markLoanRequestPaid(id);
  }
}
