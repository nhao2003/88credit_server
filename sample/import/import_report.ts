import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import Post from '../../src/models/databases/Post';
import Report from '../../src/models/databases/Report';
import { Repository } from 'typeorm';
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'posts.json'), 'utf8'));
// console.log(users);
const reports = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'reports.json'), 'utf8'));
AppDataSource.initialize().then(async (dataSource) => {
  await Report.delete({});
  dataSource
    .getRepository(Report)
    .save(reports)
    .then((reports) => {
      console.log(reports);
    });
});
