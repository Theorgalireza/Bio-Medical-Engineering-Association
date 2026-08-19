import { NewsletterService } from './newsletter.service';
import { SendCampaignDto, SubscribeDto } from './dto/newsletter.dto';
export declare class NewsletterController {
    private readonly service;
    constructor(service: NewsletterService);
    subscribe(dto: SubscribeDto, req: any): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
    }>;
    unsubscribe(token: string, req: any): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
    }>;
    getMySubscription(req: any): Promise<{
        subscribed: boolean;
    }>;
    unsubscribeMe(req: any): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
    }>;
    resubscribeMe(req: any): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        token: string;
    }>;
    getSubscribers(all?: string): Promise<({
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
    deleteSubscriber(id: string, req: any): Promise<{
        message: string;
        undoToken: string;
        undoExpiresAt: Date;
    }>;
    restoreSubscriber(token: string, req: any): Promise<any>;
    getCampaigns(): Promise<{
        body: string;
        id: string;
        createdAt: Date;
        subject: string;
        sentAt: Date | null;
        recipientCount: number;
    }[]>;
    sendCampaign(dto: SendCampaignDto, req: any): Promise<{
        body: string;
        id: string;
        createdAt: Date;
        subject: string;
        sentAt: Date | null;
        recipientCount: number;
    }>;
}
