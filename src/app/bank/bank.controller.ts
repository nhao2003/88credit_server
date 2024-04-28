import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Paging from 'src/common/types/paging.type';
import {
  BankQuery,
  BankQueryBuilder,
  BankQueryBuilderDirector,
  BankQueryPayload,
} from './query/bank_query';

@ApiTags('Bank')
@ApiBearerAuth()
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  @HttpCode(200)
  async getBanks(@Query() query: BankQueryPayload): Promise<Paging<any>> {
    const director = new BankQueryBuilderDirector(query);
    console.log(director.build());
    return await this.bankService.getBanks(director.build());
  }

  @Get(':id')
  async getBank(@Param('id') id: string) {
    return await this.bankService.getBank(id);
  }

  @Post()
  async createBank(@Body() data: any) {
    return await this.bankService.createBank(data);
  }

  @Patch(':id')
  async updateBank(@Param('id') id: string, @Body() data: any) {
    return await this.bankService.updateBank(id, data);
  }

  @Delete(':id')
  async deleteBank(@Param('id') id: string) {
    return await this.bankService.deleteBank(id);
  }
}
