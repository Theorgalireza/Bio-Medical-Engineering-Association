import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Kavenegar from 'kavenegar';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly api: any;

  constructor(private readonly config: ConfigService) {
    this.api = Kavenegar.KavenegarApi({
      apikey: this.config.get<string>('app.kavenegarApiKey')!,
    });
  }

  async sendOtp(phone: string, code: string): Promise<void> {
    const provider = this.config.get<string>('app.smsProvider');

    if (provider === 'mock') {
      this.logger.log(`[MOCK SMS] ${phone} -> ${code}`);
      return;
    }

    await new Promise<void>((resolve, reject) => {
      this.api.Send(
        {
          receptor: phone,
          message: `کد تایید شما: ${code}`,
        },
        (_response: any, status: number) => {
          if (status === 200) {
            this.logger.log(`SMS sent to ${phone}`);
            resolve();
          } else {
            reject(new Error('SMS provider request failed'));
          }
        },
      );
    });
  }
}