import { Injectable } from '@nestjs/common';
import MailProvider from './mail-provider';

@Injectable()
class MailTrapProvider implements MailProvider {
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    console.log(
      `Sending mail to ${to} with subject ${subject} and body ${body}`,
    );
  }
}

export default MailTrapProvider;
