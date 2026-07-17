import { NewsletterService } from './newsletter.service';
import { SendCampaignDto, SubscribeDto } from './dto/newsletter.dto';
export declare class NewsletterController {
    private readonly service;
    constructor(service: NewsletterService);
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
    getSubscribers(all?: string): Promise<{
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
