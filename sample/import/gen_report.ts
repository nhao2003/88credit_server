import * as fs from 'fs';
import * as path from 'path';
import Post from '../../src/models/databases/Post';
import { ReportContentType, ReportStatus, ReportType } from '../../src/constants/enum';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomText } from './gen';
interface IReport {
  id: string;
  reporter_id: string;
  reported_id: string;
  status: ReportStatus;
  type: ReportType;
  content_type: ReportContentType;
  description: string;
  images?: string[] | null;
  created_date: Date;
}

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'posts.json'), 'utf8'));
const verfiendUsers = users.filter((user: any) => {
  return user.status === 'verified';
});

const approvedPosts = posts.filter((post: any) => {
  return post.status === 'approved';
});

const reports: IReport[] = [];

for (let i = 0; i < 100; i++) {
  const reporter = verfiendUsers[Math.floor(Math.random() * verfiendUsers.length)];
  const type = Math.random() > 0.5 ? 'user' : 'post';
  const reported =
    type === 'user'
      ? verfiendUsers[Math.floor(Math.random() * verfiendUsers.length)]
      : approvedPosts[Math.floor(Math.random() * approvedPosts.length)];

  // Random date from 1/1/2023 to 31/12/2023
  const start = new Date(2023, 0, 1);
  const end = new Date(2023, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const status = Object.values(ReportStatus)[Math.floor(Math.random() * Object.values(ReportStatus).length)];
  const report: IReport = {
    id: uuidv4(),
    reporter_id: reporter.id,
    reported_id: reported.id,
    status,
    type: type as ReportType,
    content_type: Object.values(ReportContentType)[Math.floor(Math.random() * Object.values(ReportContentType).length)],
    description: generateRandomText(20),
    created_date: randomDate,
  };
  reports.push(report);
}

// Write to file
fs.writeFileSync(path.join(__dirname, '..', 'data', 'reports.json'), JSON.stringify(reports, null, 2));
