import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../../src/app/database';
import Blog from '../../src/models/databases/Blog';
import { Repository } from 'typeorm';

const blogs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'blogs.json'), 'utf8'));

AppDataSource.initialize().then(async (dataSource) => {
  const blogsRequestRepository: Repository<Blog> = dataSource.getRepository(Blog);
  await blogsRequestRepository.delete({});
  blogsRequestRepository
    .save(blogs)
    .then((result) => {
      console.log('Imported', result.length, 'loan requests');
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
