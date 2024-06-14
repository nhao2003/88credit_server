import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @MessagePattern('getDashboardData')
  async getDashboardData() {
    return this.dashboardService.getDashboardData();
  }
}
