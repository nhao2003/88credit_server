import { BadRequestException, Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import CreateLoanRequestDto from './dtos/loan_request';
import { LoanRequestQuery } from './query/loan_request_query';

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
        status: $Enums.LoanContractRequestStatus.PENDING,
        senderId: userId,
        ...data,
      },
    });
  }

  async getLoanRequests(userId: string, query: LoanRequestQuery) {
    return await this.prismaService.loanRequest.findMany({
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
    });
  }
}
