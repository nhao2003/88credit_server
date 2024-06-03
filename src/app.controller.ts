import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @EventPattern('hi')
  async handleHi(@Payload() data: any) {
    console.log(data);
  }

  @MessagePattern('Hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
