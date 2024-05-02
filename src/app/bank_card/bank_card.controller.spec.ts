import { Test, TestingModule } from '@nestjs/testing';
import { BankCardController } from './bank_card.controller';

describe('BankCardController', () => {
  let controller: BankCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankCardController],
    }).compile();

    controller = module.get<BankCardController>(BankCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
