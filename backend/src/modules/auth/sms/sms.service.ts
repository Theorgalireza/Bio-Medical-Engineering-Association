// src/modules/auth/sms/sms.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private config: ConfigService) {}

  async sendOtp(phone: string, code: string): Promise<void> {
    const provider = this.config.get('app.smsProvider');
    if (provider === 'mock') {
      this.logger.log(`[MOCK SMS] To: ${phone} | OTP: ${code}`);
      return;
    }
    // TODO: integrate Kavenegar or other provider
    // await kavenegarClient.send({ receptor: phone, message: `کد تایید: ${code}` });
  }
}
