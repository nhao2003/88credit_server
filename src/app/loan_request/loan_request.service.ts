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

@Injectable()
export class LoanRequestService {
  private prismaService: PrismaService;
  private userSelect = {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      gender: true,
      dob: true,
      phone: true,
      address: true,
    },
  };

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
      await this.prismaService.loanRequest.findMany({
        ...filter,
        include: {
          sender: this.userSelect,
          receiver: this.userSelect,
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
        },
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
      include: {
        sender: this.userSelect,
        receiver: this.userSelect,
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
      },
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
      include: {
        sender: this.userSelect,
        receiver: this.userSelect,
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
      include: {
        sender: this.userSelect,
        receiver: this.userSelect,
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
      },
    });
  }

  async cancelLoanRequest(userId: string, id: string) {
    const loanRequest = await this.getInvolvedLoanRequest(userId, id);

    const allowedStatusSenders: $Enums.LoanRequestStatus[] = [
      $Enums.LoanRequestStatus.PENDING,
      $Enums.LoanRequestStatus.APPROVED,
    ];

    const allowedStatusReceivers: $Enums.LoanRequestStatus[] = [
      $Enums.LoanRequestStatus.PENDING,
      $Enums.LoanRequestStatus.APPROVED,
      $Enums.LoanRequestStatus.WAITING_FOR_PAYMENT,
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
        status: $Enums.LoanRequestStatus.CANCELLED,
      },
      include: {
        sender: this.userSelect,
        receiver: this.userSelect,
        receiverBankCard: true,
        senderBankCard: true,
      },
    });
  }
}
