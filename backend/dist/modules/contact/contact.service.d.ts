import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class ContactService {
    private readonly prisma;
    private readonly activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    private logActivity;
    findAll(query: QueryContactDto): import(".prisma/client").Prisma.PrismaPromise<{
        email: string;
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        subject: string | null;
        read: boolean;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        subject: string | null;
        read: boolean;
    }>;
    create(dto: CreateContactDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        email: string;
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        subject: string | null;
        read: boolean;
    }>;
    update(id: string, dto: UpdateContactDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        email: string;
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        subject: string | null;
        read: boolean;
    }>;
    remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
}
