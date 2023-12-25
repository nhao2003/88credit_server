import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { genFloatNumber, genRandomDate } from './gen';
const requests = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'requests.json'), 'utf8'));

const paids = requests.filter((request: any) => request.status === 'paid');
const bankCards = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'bank_cards.json'), 'utf8'));
interface IContract {
  id: string;
  loan_contract_request_id: string;
  contract_template_id: string;
  lender_id: string;
  lender_bank_card_id: string;
  borrower_id: string;
  borrower_bank_card_id: string;
  loan_reason_type: string;
  loan_reason: string;
  amount: number;
  interest_rate: number;
  tenure_in_months: number;
  overdue_interest_rate: number;
  created_at: Date;
  expired_at: Date;
}
function getPrimaryBank(user_id: string) {
  const bank = bankCards.find((bank: any) => bank.user_id === user_id);
  return bank;
}

const contracts: IContract[] = [];
paids.forEach((paid: any) => {
  const expired_at = new Date();
  expired_at.setMonth(expired_at.getMonth() + paid.loan_tenure_months);
  const contract: IContract = {
    id: uuidv4(),
    loan_contract_request_id: paid.id,
    contract_template_id: 'f52c90be-ab65-4326-8838-b46e2cff6da3',
    lender_id: paid.receiver_id,
    lender_bank_card_id: getPrimaryBank(paid.receiver_id).id,
    borrower_id: paid.sender_id,
    borrower_bank_card_id: getPrimaryBank(paid.sender_id).id,
    loan_reason_type: paid.loan_reason_type,
    loan_reason: paid.loan_reason,
    amount: paid.loan_amount,
    interest_rate: genFloatNumber(0.01, 0.2),
    tenure_in_months: paid.loan_tenure_months,
    overdue_interest_rate: genFloatNumber(0.01, 0.2),
    created_at: genRandomDate(new Date(2023, 1, 1), new Date()),
    expired_at: expired_at,
  };
  contracts.push(contract);
});

fs.writeFileSync(path.join(__dirname, '..', 'data', 'contracts.json'), JSON.stringify(contracts, null, 2));
