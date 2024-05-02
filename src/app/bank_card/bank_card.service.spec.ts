import { Test, TestingModule } from '@nestjs/testing';
import { BankCardService } from './bank_card.service';

describe('BankCardService', () => {
  let service: BankCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankCardService],
    }).compile();

    service = module.get<BankCardService>(BankCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
