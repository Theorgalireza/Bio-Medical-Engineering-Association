// backend/src/modules/newsletter/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('app.mailHost'),
      port: this.config.get<number>('app.mailPort'),
      secure: false,
      auth: {
        user: this.config.get('app.mailUser'),
        pass: this.config.get('app.mailPass'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.config.get('app.mailFrom'),
        to,
        subject,
        html,
      });
      return true;
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  this.logger.error(`Failed to send email to ${to}: ${message}`);
  return false;
}

  }
}
