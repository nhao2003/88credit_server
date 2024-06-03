import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Paging from 'src/common/types/paging.type';
import { BankQueryBuilderDirector, BankQueryPayload } from './query/bank_query';
import { MessagePattern } from '@nestjs/microservices';
import { RpcBody, RpcParam, RpcQuery } from 'src/common/decorators';

@ApiTags('Bank')
@ApiBearerAuth()
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @MessagePattern('get-banks')
  async getBanks(@RpcQuery() query: BankQueryPayload): Promise<Paging<any>> {
    const director = new BankQueryBuilderDirector(query);
    console.log(director.build());
    return await this.bankService.getBanks(director.build());
  }

  @MessagePattern('get-bank')
  async getBank(@RpcParam('id') id: string) {
    const res = await this.bankService.getBank(id);
    if (!res) {
      throw new NotFoundException('Bank not found');
    }
    return res;
  }

  @MessagePattern('create-bank')
  async createBank(@RpcBody() data: any) {
    return await this.bankService.createBank(data);
  }

  @MessagePattern('update-bank')
  async updateBank(@RpcParam('id') id: string, @Body() data: any) {
    return await this.bankService.updateBank(id, data);
  }

  @MessagePattern('delete-bank')
  async deleteBank(@RpcParam('id') id: string) {
    return await this.bankService.deleteBank(id);
  }
}
