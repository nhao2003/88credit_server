import { Injectable } from '@nestjs/common';
import { count } from 'console';
import { first } from 'rxjs';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  async getNumberOfUsersPerStatus() {
    const res = await this.prismaService.user.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    return res.map((r) => ({
      status: r.status,
      count: r._count.status,
    }));
  }

  async getNumberOfPostPerstatus() {
    const res = await this.prismaService.post.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    return res.map((r) => ({
      status: r.status,
      count: r._count.status,
    }));
  }

  getNumberOfBlog() {
    return this.prismaService.blog.count();
  }

  async getTopUserHasMostPost() {
    const res = await this.prismaService.user.findMany({
      include: {
        Post: true,
      },
      orderBy: {
        Post: {
          _count: 'desc',
        },
      },
    });

    return res.map((r) => ({
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      count: r.Post.length,
    }));
  }

  async countPostByTypeInMonthOfYear() {
    const post = await this.prismaService.post.groupBy({
      by: ['type', 'createdAt'],
      _count: {
        type: true,
      },
    });

    return post.map((p) => ({
      type: p.type,
      month: new Date(p.createdAt).getMonth(),
      count: p._count.type,
    }));
  }

  async getDashboardData() {
    const res = await Promise.all([
      this.getNumberOfUsersPerStatus(),
      this.getNumberOfPostPerstatus(),
      this.getNumberOfBlog(),
      this.getTopUserHasMostPost(),
      this.countPostByTypeInMonthOfYear(),
    ]);

    return {
      numberOfUsersPerStatus: res[0],
      numberOfPostPerstatus: res[1],
      numberOfBlog: res[2],
      topUserHasMostPost: res[3],
      countPostByTypeInMonthOfYear: res[4],
    };
  }
}
