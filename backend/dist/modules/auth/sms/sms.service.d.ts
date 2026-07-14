import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private readonly config;
    private readonly logger;
    private readonly api;
    constructor(config: ConfigService);
    sendOtp(phone: string, code: string): Promise<void>;
}
