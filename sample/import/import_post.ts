import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import Post from '../../src/models/databases/Post';
import { Repository } from 'typeorm';
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'posts.json'), 'utf8'));
// console.log(users);

AppDataSource.initialize().then(async (dataSource) => {
  await Post.delete({});
  dataSource
    .getRepository(Post)
    .save(posts)
    .then((posts) => {
      console.log(posts);
    });
});
