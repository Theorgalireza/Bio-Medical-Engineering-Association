import { AnnouncementType, ContentStatus } from '@prisma/client';
export declare class CreateAnnouncementDto {
    title: string;
    description: string;
    type: AnnouncementType;
    imageUrl?: string;
    isNew?: boolean;
    status?: ContentStatus;
}
export declare class UpdateAnnouncementDto {
    title?: string;
    description?: string;
    type?: AnnouncementType;
    imageUrl?: string;
    isNew?: boolean;
    status?: ContentStatus;
}
export declare class QueryAnnouncementDto {
    status?: ContentStatus;
    type?: AnnouncementType;
    search?: string;
}
