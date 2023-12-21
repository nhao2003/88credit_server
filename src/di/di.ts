import Container from 'typedi';
import { DataSource } from 'typeorm';
import { AppDataSource } from '~/app/database';
import nodemailer, { Transporter } from 'nodemailer';
import AppConfig from '~/constants/configs';
import MailService from '~/services/mail.service';
import ZaloPayService from '~/services/zalopay.service';

class DependencyInjection {
  private static instance: DependencyInjection = new DependencyInjection();
  private constructor() {
    Container.set<DataSource>(DataSource, AppDataSource);
    Container.set<ZaloPayService>(ZaloPayService, new ZaloPayService());
    Container.set<nodemailer.Transporter>(
      MailService,
      new MailService(
        nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: AppConfig.SMTP_USERNAME,
            pass: AppConfig.SMTP_PASSWORD,
          },
        }),
      ),
    );
  }
  public static getInstance(): DependencyInjection {
    return DependencyInjection.instance;
  }
  public get<T>(type: any): T {
    return Container.get<T>(type);
  }
  public set<T>(type: any, value: T): void {
    Container.set<T>(type, value);
  }
}
export default DependencyInjection.getInstance();
