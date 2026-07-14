import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
export declare class ContactController {
    private readonly service;
    constructor(service: ContactService);
    findAll(query: QueryContactDto): import(".prisma/client").Prisma.PrismaPromise<{
        email: string;
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        subject: string | null;
        read: boolean;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        subject: string | null;
        read: boolean;
    }>;
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactClient<{
        email: string;
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        subject: string | null;
        read: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateContactDto): Promise<{
        email: string;
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        subject: string | null;
        read: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
