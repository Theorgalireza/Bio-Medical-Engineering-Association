import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
export declare class ContactController {
    private readonly service;
    constructor(service: ContactService);
    findAll(query: QueryContactDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        email: string;
        subject: string | null;
        message: string;
        read: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        subject: string | null;
        message: string;
        read: boolean;
        createdAt: Date;
    }>;
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactClient<{
        id: string;
        name: string;
        email: string;
        subject: string | null;
        message: string;
        read: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateContactDto): Promise<{
        id: string;
        name: string;
        email: string;
        subject: string | null;
        message: string;
        read: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
