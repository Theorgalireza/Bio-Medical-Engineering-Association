import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
export declare class ContactController {
    private readonly service;
    constructor(service: ContactService);
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
    create(req: any, dto: CreateContactDto): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        subject: string | null;
        read: boolean;
    }>;
    update(req: any, id: string, dto: UpdateContactDto): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        subject: string | null;
        read: boolean;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
