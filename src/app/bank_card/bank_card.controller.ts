import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Response,
} from '@nestjs/common';
import CreateBankCardDto from './dtos/create_bank_card_dto';
import { ApiTags } from '@nestjs/swagger';
import {
  GetCurrentUser,
  GetCurrentUserId,
  ResponseMessage,
} from 'src/common/decorators';
import { BankCardService } from './bank_card.service';

@Controller('bank-card')
@ApiTags('Bank Card')
export class BankCardController {
  constructor(private readonly bankCardService: BankCardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBankCard(
    @GetCurrentUserId() userId: string,
    @Body() data: CreateBankCardDto,
  ) {
    return await this.bankCardService.createBankCard(userId, data);
  }

  @Get()
  async getBankCards(@GetCurrentUserId() userId: string) {
    return await this.bankCardService.getBankCardsByUserId(userId);
  }

  @Patch(':cardNumber/primary')
  async makePrimaryBankCard(
    @GetCurrentUserId() userId: string,
    @Param('cardNumber') cardNumber: string,
  ) {
    return await this.bankCardService.makePrimaryBankCard(userId, cardNumber);
  }

  @Get('primary')
  async getPrimaryBankCard(@GetCurrentUserId() userId: string) {
    return await this.bankCardService.getPrimaryBankCard(userId);
  }
}
