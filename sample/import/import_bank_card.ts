import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import { Repository } from 'typeorm';
import Bank from '../../src/models/databases/Bank';
import { v4 as uuidv4 } from 'uuid';
import BankCard from '../../src/models/databases/BankCard';
const bankCards = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'bank_cards.json'), 'utf8'));
type IBankCard = {
  id: string;
  is_primary: boolean;
  user_id: string;
  bank_id: string;
  card_number: string;
  branch: string | null;
  created_at: Date;
  deleted_at: Date | null;
};

AppDataSource.initialize().then(async (dataSource) => {
  const bankCardRepository: Repository<BankCard> = dataSource.getRepository(BankCard);
  await bankCardRepository.delete({});
  bankCardRepository.save(bankCards).then((bankCards) => {
    console.log(bankCards);
  });
});
