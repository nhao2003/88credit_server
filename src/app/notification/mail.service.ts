import { Inject, Injectable } from '@nestjs/common';
import MailProvider from '../../core/services/mail/mail-provider';

type MailData = {
  to: string;
  subject: string;
  body: string;
};
@Injectable()
export class MailService {
  constructor(@Inject('MailProvider') private mailProvider: MailProvider) {}

  async sendMail(mailData: MailData): Promise<void> {
    return this.mailProvider.sendMail(
      mailData.to,
      mailData.subject,
      mailData.body,
    );
  }
}
