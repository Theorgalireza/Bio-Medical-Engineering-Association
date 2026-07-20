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
        id: string;
        email: string;
        token: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    unsubscribe(token: string): Promise<{
        id: string;
        email: string;
        token: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    getMySubscription(email: string): Promise<{
        subscribed: boolean;
    }>;
    unsubscribeMe(email: string): Promise<{
        id: string;
        email: string;
        token: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    resubscribeMe(email: string): Promise<{
        id: string;
        email: string;
        token: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    getSubscribers(onlyActive?: boolean): Promise<({
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        token: string | null;
        source: "user";
    } | {
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        token: string;
        source: "guest";
    })[]>;
    deleteSubscriber(id: string): Promise<{
        id: string;
        email: string;
        token: string;
        name: string | null;
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
