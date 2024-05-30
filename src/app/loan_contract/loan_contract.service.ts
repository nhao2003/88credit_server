import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { LoanContractQuery } from './query/loan_contract.query';
import Paging from 'src/common/types/paging.type';
import { LoanContract } from '@prisma/client';

@Injectable()
export class LoanContractService {
  constructor(private readonly prisma: PrismaService) {}

  private loanContractInclude = {
    borrower: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    },
    lender: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    },
    borrowerBankCard: {
      include: {
        bank: true,
      },
    },
    lenderBankCard: {
      include: {
        bank: true,
      },
    },
  };

  async getLoanContracts(
    filter?: any,
    include?: any,
  ): Promise<Paging<LoanContract>> {
    const { skip, take, where, orderBy } = filter;
    const [data, total] = await Promise.all([
      this.prisma.loanContract.findMany({
        where,
        skip,
        take,
        orderBy,
        include,
      }),
      this.prisma.loanContract.count({ where }),
    ]);
    return {
      page: skip / take + 1,
      totalPages: Math.ceil(total / take),
      take,
      items: data,
    };
  }

  async getBorrowerLoanContracts(
    userId: string,
    query: LoanContractQuery,
  ): Promise<Paging<LoanContract>> {
    const filter = {
      take: query.take,
      skip: query.skip,
      where: {
        borrowerId: userId,
      },
      orderBy: {
        ...query.orderBy,
      },
    };
    return this.getLoanContracts(filter, this.loanContractInclude);
  }

  async getLenderLoanContracts(
    userId: string,
    query: LoanContractQuery,
  ): Promise<Paging<LoanContract>> {
    const filter = {
      take: query.take,
      skip: query.skip,
      where: {
        lenderId: userId,
      },
      orderBy: {
        ...query.orderBy,
      },
    };
    return this.getLoanContracts(filter, this.loanContractInclude);
  }
}
