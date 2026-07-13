import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    sendOtp(phone: string, code: string): Promise<void>;
}
