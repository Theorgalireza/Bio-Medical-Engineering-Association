import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { SubscribeDto, SendCampaignDto } from './dto/newsletter.dto';
export declare class NewsletterService {
    private prisma;
    private mail;
    private config;
    constructor(prisma: PrismaService, mail: MailService, config: ConfigService);
    subscribe(dto: SubscribeDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        token: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    unsubscribe(token: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        token: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    getSubscribers(onlyActive?: boolean): Promise<{
        name: string | null;
        id: string;
        email: string;
        token: string;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    deleteSubscriber(id: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        token: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    getCampaigns(): Promise<{
        id: string;
        createdAt: Date;
        subject: string;
        body: string;
        sentAt: Date | null;
        recipientCount: number;
    }[]>;
    sendCampaign(dto: SendCampaignDto): Promise<{
        id: string;
        createdAt: Date;
        subject: string;
        body: string;
        sentAt: Date | null;
        recipientCount: number;
    }>;
}
