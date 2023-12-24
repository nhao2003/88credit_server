import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import { Repository } from 'typeorm';
import Bank from '../../src/models/databases/Bank';

const banks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'banks.json'), 'utf8'));

AppDataSource.initialize().then(async (dataSource) => {
  await dataSource.getRepository(Bank).delete({});
  dataSource
    .getRepository(Bank)
    .save(banks)
    .then((banks) => {
      console.log(banks);
    });
});
