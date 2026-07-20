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
      html: this.wrapEmailTemplate(html),
    });
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    this.logger.error(`Failed to send email to ${to}: ${message}`);
    return false;
  }
}

private wrapEmailTemplate(body: string): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
<meta charset="UTF-8" />
<style>
  @font-face {
    font-family: 'Vazirmatn';
    src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.0.3/fonts/webfonts/Vazirmatn-Regular.woff2') format('woff2');
    font-weight: normal;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f4f5;
  }
  .email-wrapper {
    font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.9;
    direction: rtl;
    text-align: right;
    color: #1f2937;
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
    background-color: #ffffff;
  }
</style>
</head>
<body>
  <div class="email-wrapper" dir="rtl">
    ${body}
  </div>
</body>
</html>`;
}

}
