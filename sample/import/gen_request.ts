import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import { User } from '../../src/models/databases/User';
import { Repository } from 'typeorm';
import { functionGenPictureUrl, genLoanContractRequestStatus, genLoanReason, generateRandomText } from './gen';
import { LoanContractRequestStatus } from '../../src/constants/enum';
import { v4 as uuidv4 } from 'uuid';
const bankCards = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'bank_cards.json'), 'utf8'));
interface LoanRequestInterface {
  id: string;
  status: LoanContractRequestStatus;
  sender_id: string;
  receiver_id: string;
  description: string;
  loan_amount: number;
  interest_rate: number;
  overdue_interest_rate: number;
  loan_tenure_months: number;
  loan_reason_type: string;
  loan_reason: string;
  video_comfirmation: string;
  portait_photo: string;
  id_card_front_photo: string;
  id_card_back_photo: string;
  sender_bank_card_id: string;
  receiver_bank_card_id: string;
  rejected_reason: string | null;
}

const requests: LoanRequestInterface[] = [];

for (let i = 0; i < 200; i++) {
  const status = genLoanContractRequestStatus();
  const sender = bankCards[Math.floor(Math.random() * bankCards.length)];
  const receiver = bankCards[Math.floor(Math.random() * bankCards.length)];
  const request: LoanRequestInterface = {
    status: status as LoanContractRequestStatus,
    sender_id: sender.user_id,
    receiver_id: receiver.user_id,
    description: generateRandomText(20),
    loan_amount: Math.floor(Math.random() * 10000000),
    interest_rate: Math.floor(Math.random() * 100),
    overdue_interest_rate: Math.floor(Math.random() * 100),
    loan_tenure_months: Math.floor(Math.random() * 100),
    loan_reason_type: genLoanReason(),
    loan_reason: generateRandomText(20),
    video_comfirmation: Math.random() > 0.5
      ? 'https://res.cloudinary.com/devfdx8fs/video/upload/v1/videos/291533f8-3425-4b09-8860-d5197def01f2'
      : 'https://res.cloudinary.com/devfdx8fs/video/upload/v1/videos/fad48de9-ac7e-482f-aca6-8d09d2c5379a',
    sender_bank_card_id: sender.id,
    receiver_bank_card_id: status === 'waiting_for_payment' || status === 'paid' ? receiver.id : null,
    id: uuidv4(),
    portait_photo: functionGenPictureUrl(),
    id_card_front_photo: functionGenPictureUrl(),
    id_card_back_photo: functionGenPictureUrl(),
    rejected_reason: status === 'rejected' ? generateRandomText(20) : null,
  };
  requests.push(request);
}

// Write file
fs.writeFileSync(path.join(__dirname, '..', 'data', 'requests.json'), JSON.stringify(requests, null, 2));
