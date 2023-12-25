import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import { User } from '../../src/models/databases/User';
import { Repository } from 'typeorm';
import { genLoanContractRequestStatus, genLoanReason, generateRandomText } from './gen';
import LoanRequest from '../../src/models/databases/LoanRequest';

const requests = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'requests.json'), 'utf8'));

const data: any = [];

function randomFloat(min: number, max: number) {
  const val = Math.random() * (max - min) + min;
  // Round to 2 decimal places
  return Math.round(val * 100) / 100;
}

requests.forEach((request: any) => {
  request.interest_rate = randomFloat(0.01, 0.2);
  request.overdue_interest_rate = randomFloat(0.01, 0.2);
  
  data.push(request);
});

// Update file
fs.writeFileSync(path.join(__dirname, '..', 'data', 'requests.json'), JSON.stringify(data, null, 2));
