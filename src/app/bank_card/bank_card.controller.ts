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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetCurrentUser,
  GetCurrentUserId,
  ResponseMessage,
  RpcBody,
  RpcParam,
  RpcUserId,
} from 'src/common/decorators';
import { BankCardService } from './bank_card.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('bank-card')
@ApiTags('Bank Card')
@ApiBearerAuth()
export class BankCardController {
  constructor(private readonly bankCardService: BankCardService) {}

  @MessagePattern('create-bank-card')
  async createBankCard(
    @RpcUserId() userId: string,
    @RpcBody() data: CreateBankCardDto,
  ) {
    return await this.bankCardService.createBankCard(userId, data);
  }

  @MessagePattern('get-bank-cards')
  async getBankCards(@RpcUserId() userId: string) {
    // return (await this.bankCardService.getBankCardsByUserId(userId)) || [];
    const bankCards = await this.bankCardService.getBankCardsByUserId(userId);
    return bankCards || [];
  }

  @MessagePattern('get-bank-card')
  async getBankCard(
    @RpcUserId() userId: string,
    @RpcParam('cardNumber') cardNumber: string,
  ) {
    return await this.bankCardService.getBankCard(userId, cardNumber);
  }

  @MessagePattern('mark-primary-bank-card')
  async makePrimaryBankCard(
    @RpcUserId() userId: string,
    @RpcParam('cardNumber') cardNumber: string,
  ) {
    return await this.bankCardService.makePrimaryBankCard(userId, cardNumber);
  }

  @MessagePattern('get-primary-bank-card')
  async getPrimaryBankCard(@RpcUserId() userId: string) {
    const primaryBankCard =
      await this.bankCardService.getPrimaryBankCard(userId);
    return primaryBankCard;
  }
}
