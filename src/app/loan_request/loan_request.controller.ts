import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CreateLoanRequestDto from './dtos/loan_request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
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

  @Get()
  async getLoanRequest(
    @GetCurrentUserId() userId: string,
    @Query() query: LoanRequestQueryPayload,
  ) {
    const director = new LoanRequestQueryBuilderDirector(query);
    const queryBuilder = director.build();
    return await this.loanRequestService.getLoanRequests(userId, queryBuilder);
  }
}