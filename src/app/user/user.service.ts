import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { UserQuery } from './query/user-query';
import { $Enums, User } from '@prisma/client';
import Paging from 'src/common/types/paging.type';

@Injectable()
export class UserService {
  constructor(private readonly prisamService: PrismaService) {}

  async getUserById(id: string) {
    const res = await this.prisamService.user.findUnique({
      where: {
        id,
      },
    });

    if (!res) {
      throw new NotFoundException('User not found');
    }

    return res;
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

  async ban(id: string, banUntil: Date, reason: string) {
    const user = await this.getUserById(id);
    user.banUntil = new Date(banUntil);
    user.banReason = reason;
    return await this.prisamService.user.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async unban(id: string) {
    const user = await this.getUserById(id);
    user.banUntil = null;
    user.banReason = null;
    return await this.prisamService.user.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id);
    user.phone = updateUserDto.phone;
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.dob = new Date(updateUserDto.dob);

    if (user.status === $Enums.AccountStatus.notUpdated) {
      user.status = $Enums.AccountStatus.verified;
    }

    return await this.prisamService.user.update({
      where: {
        id,
      },
      data: user,
    });
  }
}
