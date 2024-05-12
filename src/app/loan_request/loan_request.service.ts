import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, LoanRequest, LoanRequestStatus, Post } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import CreateLoanRequestDto from './dtos/loan_request';
import { LoanRequestQuery } from './query/loan_request_query';
import { NotFoundError } from 'rxjs';
import Paging from 'src/common/types/paging.type';

@Injectable()
export class LoanRequestService {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async createLoanRequest(userId: string, data: CreateLoanRequestDto) {
    const [receiver, bankCard] = await Promise.all([
      this.prismaService.user.findFirst({
        where: {
          id: data.receiverId,
        },
      }),
      this.prismaService.bankCard.findFirst({
        where: {
          id: data.senderBankCardId,
        },
      }),
    ]);

    if (!receiver || !bankCard) {
      throw new BadRequestException('Receiver or bank card not found');
    } else if (receiver.id === userId) {
      throw new BadRequestException('You cannot send loan request to yourself');
    } else if (bankCard.userId !== userId) {
      throw new BadRequestException('Bank card not found');
    }

    return await this.prismaService.loanRequest.create({
      data: {
        status: $Enums.LoanRequestStatus.PENDING,
        senderId: userId,
        ...data,
      },
    });
  }

  async getLoanRequests(
    userId: string,
    query: LoanRequestQuery,
  ): Promise<Paging<LoanRequest>> {
    const filter = {
      take: query.take,
      skip: query.skip,
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
        ...query.where,
      },
      orderBy: {
        ...query.orderBy,
      },
    };
    const result = await Promise.all([
      this.prismaService.loanRequest.count(filter),
      await this.prismaService.loanRequest.findMany(filter),
    ]);
    return {
      page: query.skip / query.take + 1,
      take: query.take,
      totalPages: Math.ceil(result[0] / query.take),
      items: result[1],
    };
  }
  private async getInvolvedLoanRequest(userId: string, loanRequestId: string) {
    const loanRequest = await this.prismaService.loanRequest.findFirst({
      where: {
        id: loanRequestId,
      },
    });

    if (!loanRequest) {
      throw new NotFoundException('Loan request not found');
    }

    if (loanRequest.senderId !== userId && loanRequest.receiverId !== userId) {
      throw new BadRequestException(
        'You are not involved in this loan request',
      );
    }

    return loanRequest;
  }

  async approveLoanRequest(userId: string, loanRequestId: string) {
    const loanRequest = await this.getInvolvedLoanRequest(
      userId,
      loanRequestId,
    );

    if (loanRequest.status !== $Enums.LoanRequestStatus.PENDING) {
      throw new BadRequestException('Loan request is not pending');
    }

    return this.prismaService.loanRequest.update({
      where: {
        id: loanRequestId,
      },
      data: {
        status: $Enums.LoanRequestStatus.APPROVED,
        receiverId: userId,
      },
    });
  }

  async rejectLoanRequest(userId: string, loanRequestId: string) {
    const loanRequest = await this.getInvolvedLoanRequest(
      userId,
      loanRequestId,
    );

    if (loanRequest.status !== $Enums.LoanRequestStatus.PENDING) {
      throw new BadRequestException('Loan request is not pending');
    }
    return this.prismaService.loanRequest.update({
      where: {
        id: loanRequestId,
      },
      data: {
        status: $Enums.LoanRequestStatus.REJECTED,
        receiverId: userId,
      },
    });
  }
}
