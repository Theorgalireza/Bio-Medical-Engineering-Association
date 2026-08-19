import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { SubscribeDto, SendCampaignDto } from './dto/newsletter.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class NewsletterService {
    private prisma;
    private mail;
    private config;
    private activityLog;
    constructor(prisma: PrismaService, mail: MailService, config: ConfigService, activityLog: ActivityLogService);
    private logActivity;
    subscribe(dto: SubscribeDto, ip?: string | null): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
    }>;
    unsubscribe(token: string, ip?: string | null): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
    }>;
    getMySubscription(email: string): Promise<{
        subscribed: boolean;
    }>;
    unsubscribeMe(email: string, ip?: string | null): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
    }>;
    resubscribeMe(email: string, ip?: string | null): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
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
    deleteSubscriber(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
        undoToken: string;
        undoExpiresAt: Date;
    }>;
    restoreSubscriber(token: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<any>;
    getCampaigns(): Promise<{
        body: string;
        id: string;
        createdAt: Date;
        subject: string;
        sentAt: Date | null;
        recipientCount: number;
    }[]>;
    sendCampaign(dto: SendCampaignDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        body: string;
        id: string;
        createdAt: Date;
        subject: string;
        sentAt: Date | null;
        recipientCount: number;
    }>;
}
