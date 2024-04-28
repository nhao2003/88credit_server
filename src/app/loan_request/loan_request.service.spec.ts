import { Test, TestingModule } from '@nestjs/testing';
import { LoanRequestService } from './loan_request.service';

describe('LoanRequestService', () => {
  let service: LoanRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanRequestService],
    }).compile();

    service = module.get<LoanRequestService>(LoanRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
