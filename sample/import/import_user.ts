import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import { User } from '../../src/models/databases/User';
import { Repository } from 'typeorm';
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'), 'utf8'));
// console.log(users);

AppDataSource.initialize().then(async (dataSource) => {
  dataSource
    .getRepository(User)
    .save(users)
    .then((users) => {
      console.log(users);
    });
});
