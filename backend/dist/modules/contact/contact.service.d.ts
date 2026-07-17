import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class ContactService {
    private readonly prisma;
    private readonly activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    private logActivity;
    findAll(query: QueryContactDto): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        subject: string | null;
        read: boolean;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        subject: string | null;
        read: boolean;
    }>;
    create(dto: CreateContactDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        subject: string | null;
        read: boolean;
    }>;
    update(id: string, dto: UpdateContactDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        subject: string | null;
        read: boolean;
    }>;
    remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
}
