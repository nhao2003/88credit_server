import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

class MailService {
  private transporter: nodemailer.Transporter;
  private comfirmationEmailTemplate;
  private recoveryPasswordEmailTemplate;
  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter;
    this.comfirmationEmailTemplate = fs.readFileSync(
      path.join(__dirname, '..', '..', 'assets', 'templates', 'confirmation-email.html'),
      'utf-8',
    );
    this.recoveryPasswordEmailTemplate = fs.readFileSync(
      path.join(__dirname, '..', '..', 'assets', 'templates', 'recovery-email.html'),
      'utf-8',
    );
  }

  public async sendMail(to: string, subject: string, html: string) {
    return new Promise<void>((resolve, reject) => {
      this.transporter.sendMail(
        {
          from: process.env.SMTP_FROM,
          to,
          subject,
          html,
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  public async sendConfirmationEmail(to: string, code: string) {
    const template = this.comfirmationEmailTemplate.replace('{{CODE}}', code);
    await this.sendMail(to, 'Vui lòng xác minh email của bạn', template);
  }

  public async sendRecoveryPasswordEmail(to: string, code: string) {
    const template = this.recoveryPasswordEmailTemplate.replace('{{code}}', code);
    await this.sendMail(to, 'Mã xác nhận đổi mật khẩu', template);
  }
}

export default MailService;
