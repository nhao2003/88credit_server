import { Injectable } from '@nestjs/common';
import Paging from 'src/common/types/paging.type';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { Bank } from '@prisma/client';
import prisma from '@prisma/client/index';
import {
  BankQuery,
  BankQueryBuilderDirector,
  BankQueryPayload,
} from './query/bank_query';
import { query } from 'express';

@Injectable()
export class BankService {
  private prismaService: PrismaService;
  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async getBanks(query: BankQuery): Promise<Paging<Bank>> {
    const promies = await Promise.all([
      this.prismaService.bank.findMany({
        ...query,
      }),
      this.prismaService.bank.count(),
    ]);
    return {
      page: query.skip / query.take + 1,
      totalPages: Math.ceil(promies[1] / query.take),
      take: query.take,
      items: promies[0],
    };
  }

  async getBank(id: string) {
    return await this.prismaService.bank.findUnique({
      where: {
        id,
      },
    });
  }

  async createBank(data: any) {
    return await this.prismaService.bank.create({
      data,
    });
  }

  async updateBank(id: string, data: any) {
    return await this.prismaService.bank.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteBank(id: string) {
    return await this.prismaService.bank.delete({
      where: {
        id,
      },
    });
  }
}
