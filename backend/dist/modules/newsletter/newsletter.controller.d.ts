import { NewsletterService } from './newsletter.service';
import { SendCampaignDto, SubscribeDto } from './dto/newsletter.dto';
export declare class NewsletterController {
    private readonly service;
    constructor(service: NewsletterService);
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
    getMySubscription(req: any): Promise<{
        subscribed: boolean;
    }>;
    unsubscribeMe(req: any): Promise<{
        id: string;
        email: string;
        token: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    resubscribeMe(req: any): Promise<{
        id: string;
        email: string;
        token: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
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
