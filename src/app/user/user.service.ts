import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { UserQuery } from './query/user-query';
import { User } from '@prisma/client';
import Paging from 'src/common/types/paging.type';

@Injectable()
export class UserService {
  constructor(private readonly prisamService: PrismaService) {}

  getUserById(id: string) {
    return this.prisamService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUsers(query: UserQuery): Promise<Paging<User>> {
    const filter = {
      where: query.where,
      orderBy: query.orderBy,
      skip: query.skip,
      take: query.take,
    };
    const [users, total] = await Promise.all([
      this.prisamService.user.findMany(filter),
      this.prisamService.user.count({
        where: query.where,
      }),
    ]);
    return {
      page: query.skip / query.take + 1,
      take: query.take,
      totalPages: Math.ceil(total / query.take),
      items: users,
    };
  }

  ban(id: string, banUntil: Date, reason: string) {
    return this.prisamService.user.update({
      where: {
        id,
      },
      data: {
        banUntil,
        banReason: reason,
      },
    });
  }

  unban(id: string) {
    return this.prisamService.user.update({
      where: {
        id,
      },
      data: {
        banUntil: null,
        banReason: null,
      },
    });
  }
}
