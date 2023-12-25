import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import { User } from '../../src/models/databases/User';
import { Repository } from 'typeorm';
import { genLoanContractRequestStatus, genLoanReason, generateRandomText } from './gen';
import LoanRequest from '../../src/models/databases/LoanRequest';
import Contract from '../../src/models/databases/Contract';

const contracts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'contracts.json'), 'utf8'));

AppDataSource.initialize().then(async (dataSource) => {
  const contractRequestRepository: Repository<Contract> = dataSource.getRepository(Contract);

  await contractRequestRepository.delete({});
  contractRequestRepository
    .save(contracts)
    .then((result) => {
      console.log('Imported', result.length, 'loan requests');
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
