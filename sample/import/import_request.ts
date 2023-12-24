import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import { User } from '../../src/models/databases/User';
import { Repository } from 'typeorm';
import { genLoanContractRequestStatus, genLoanReason, generateRandomText } from './gen';
import LoanRequest from '../../src/models/databases/LoanRequest';

const requests = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'requests.json'), 'utf8'));

AppDataSource.initialize().then(async (dataSource) => {
  const loanRequestRepository: Repository<LoanRequest> = dataSource.getRepository(LoanRequest);

  await loanRequestRepository.delete({});
  loanRequestRepository
    .save(requests)
    .then((result) => {
      console.log('Imported', result.length, 'loan requests');
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
