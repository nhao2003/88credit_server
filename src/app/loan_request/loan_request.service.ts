import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, LoanRequest } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import CreateLoanRequestDto from './dtos/loan_request';
import { LoanRequestQuery } from './query/loan_request_query';
import Paging from 'src/common/types/paging.type';
import { ZaloPayService } from 'src/core/services/payment/zalopay.service';
import { BankCardService } from '../bank_card/bank_card.service';

@Injectable()
export class LoanRequestService {
  async payLoanRequest(userId: string, id: string) {
    const loanRequest = await this.getInvolvedLoanRequest(userId, id);
    const allowStatus: $Enums.LoanRequestStatus[] = [
      $Enums.LoanRequestStatus.approved,
    ];
    if (userId !== loanRequest.receiverId) {
      throw new BadRequestException(
        'You are not the receiver of this loan request',
      );
    } else if (!allowStatus.includes(loanRequest.status)) {
      throw new BadRequestException(
        'Loan request is not approved or waiting for payment',
      );
    }
    return this.zalopayService.createOrder({
      amount: 10000,
      description: 'Pay loan request',
      app_user: userId,
      item: [
        {
          item: 'Loan request',
          id: loanRequest.id,
        },
      ],
      embed_data: {
        loan_request_id: loanRequest.id,
      },
      bank_code: 'zalopayapp',
      app_time: new Date(),
    });
  }
  private requestInclude = {
    sender: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    },
    receiver: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    },
    receiverBankCard: {
      include: {
        bank: true,
      },
    },
    senderBankCard: {
      include: {
        bank: true,
      },
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly zalopayService: ZaloPayService,
    private bankCardService: BankCardService,
  ) {}

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
        status: $Enums.LoanRequestStatus.pending,
        senderId: userId,
        ...data,
      },
    });
  }

  async getSentLoanRequests(
    userId: string,
    query: LoanRequestQuery,
  ): Promise<Paging<LoanRequest>> {
    const filter = {
      take: query.take,
      skip: query.skip,
      where: {
        senderId: userId,
        ...query.where,
      },
      orderBy: {
        ...query.orderBy,
      },
    };
    return this.getLoanRequests(query, filter, this.requestInclude);
  }

  async getReceivedLoanRequests(
    userId: string,
    query: LoanRequestQuery,
  ): Promise<Paging<LoanRequest>> {
    const filter = {
      take: query.take,
      skip: query.skip,
      where: {
        receiverId: userId,
        ...query.where,
      },
      orderBy: {
        ...query.orderBy,
      },
    };
    return this.getLoanRequests(query, filter, this.requestInclude);
  }

  private async getLoanRequests(
    query: LoanRequestQuery,
    filter?: any,
    include?: any,
  ): Promise<Paging<LoanRequest>> {
    const result = await Promise.all([
      this.prismaService.loanRequest.count(filter),
      await this.prismaService.loanRequest.findMany({
        ...filter,
        include: include,
      }),
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
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
      include: this.requestInclude,
    });

    if (!loanRequest) {
      throw new NotFoundException('Loan request not found');
    }

    return loanRequest;
  }

  async approveLoanRequest(userId: string, loanRequestId: string) {
    const loanRequest = await this.getInvolvedLoanRequest(
      userId,
      loanRequestId,
    );

    if (loanRequest.status !== $Enums.LoanRequestStatus.pending) {
      throw new BadRequestException('Loan request is not pending');
    }

    if (loanRequest.senderId === userId) {
      throw new BadRequestException('You cannot approve your own loan request');
    }

    const bankCard = await this.bankCardService.getPrimaryBankCard(userId);

    if (!bankCard) {
      throw new BadRequestException('You must have a primary bank card');
    }

    return this.prismaService.loanRequest.update({
      where: {
        id: loanRequestId,
      },
      data: {
        status: $Enums.LoanRequestStatus.approved,
        receiverId: userId,
        receiverBankCardId: bankCard.id,
      },
      include: this.requestInclude,
    });
  }

  async rejectLoanRequest(userId: string, loanRequestId: string) {
    const loanRequest = await this.getInvolvedLoanRequest(
      userId,
      loanRequestId,
    );

    if (loanRequest.status !== $Enums.LoanRequestStatus.pending) {
      throw new BadRequestException('Loan request is not pending');
    }
    return this.prismaService.loanRequest.update({
      where: {
        id: loanRequestId,
      },
      data: {
        status: $Enums.LoanRequestStatus.rejected,
        receiverId: userId,
      },
      include: this.requestInclude,
    });
  }

  async cancelLoanRequest(userId: string, id: string) {
    const loanRequest = await this.getInvolvedLoanRequest(userId, id);

    const allowedStatusSenders: $Enums.LoanRequestStatus[] = [
      $Enums.LoanRequestStatus.paid,
      $Enums.LoanRequestStatus.approved,
    ];

    const allowedStatusReceivers: $Enums.LoanRequestStatus[] = [
      $Enums.LoanRequestStatus.paid,
      $Enums.LoanRequestStatus.approved,
    ];

    if (
      (loanRequest.senderId === userId &&
        !allowedStatusSenders.includes(loanRequest.status)) ||
      (loanRequest.receiverId === userId &&
        !allowedStatusReceivers.includes(loanRequest.status))
    ) {
      throw new BadRequestException('Loan request cannot be cancelled', {
        cause: {
          status: loanRequest.status,
          senderId: loanRequest.senderId,
          receiverId: loanRequest.receiverId,
        },
        description:
          userId === loanRequest.senderId
            ? 'You only can cancel pending or approved loan request'
            : 'You only can cancel pending, approved or waiting for payment loan request',
      });
    }
    return this.prismaService.loanRequest.update({
      where: {
        id,
      },
      data: {
        status: $Enums.LoanRequestStatus.cancelled,
      },
      include: this.requestInclude,
    });
  }

  async markLoanRequestPaid(loanRequestId: string) {
    const request = await this.prismaService.loanRequest.update({
      where: {
        id: loanRequestId,
      },
      data: {
        status: $Enums.LoanRequestStatus.paid,
      },
      include: this.requestInclude,
    });
    const result = await this.prismaService.loanContract.create({
      data: {
        borrowerId: request.senderId,
        lenderId: request.receiverId,
        amount: request.loanAmount,
        loanRequestId: request.id,
        tenureInMonths: request.loanTenureMonths,
        interestRate: request.interestRate,
        loanReason: request.loanReason,
        loanReasonType: request.loanReasonType,
        overdueInterestRate: request.overdueInterestRate,
        borrowerBankCardId: request.senderBankCardId,
        lenderBankCardId: request.receiverBankCardId,
      },
    });
    return result;
  }
}
