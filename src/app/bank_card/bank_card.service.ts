import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import CreateBankCardDto from './dtos/create_bank_card_dto';

@Injectable()
export class BankCardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBankCards() {
    return await this.prismaService.bankCard.findMany();
  }

  async getBankCardsByUserId(userId: string) {
    return await this.prismaService.bankCard.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  async createBankCard(userId: string, data: CreateBankCardDto) {
    const [isPrimary, bank, bankCard] = await Promise.all([
      this.prismaService.bankCard.count({
        where: {
          userId,
          isPrimary: true,
        },
      }),
      this.prismaService.bank.findUnique({
        where: {
          code: data.bankCode,
        },
      }),
      this.prismaService.bankCard.findUnique({
        where: {
          cardNumber: data.cardNumber,
        },
      }),
    ]);

    if (bankCard) {
      throw new BadRequestException('Bank card already exists', {
        description: 'Bank card already exists',
      });
    }
    return await this.prismaService.bankCard.create({
      data: {
        bankId: bank.id,
        cardNumber: data.cardNumber,
        isPrimary: isPrimary === 0,
        userId,
      },
    });
  }

  async makePrimaryBankCard(userId: string, cardNumber: string) {
    const bankCard = await this.prismaService.bankCard.findUnique({
      where: {
        userId,
        cardNumber,
      },
    });

    if (!bankCard) {
      throw new BadRequestException('Bank card not found');
    }
    const data = await Promise.all([
      this.prismaService.bankCard.updateMany({
        where: {
          userId,
          cardNumber: {
            not: cardNumber,
          },
        },
        data: {
          isPrimary: false,
        },
      }),
      this.prismaService.bankCard.update({
        where: {
          userId,
          cardNumber,
        },
        data: {
          isPrimary: true,
        },
      }),
    ]);

    return data[1];
  }

  async getPrimaryBankCard(userId: string) {
    return await this.prismaService.bankCard.findFirst({
      where: {
        userId,
        isPrimary: true,
      },
    });
  }
}
