import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
export declare class ContactService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryContactDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        message: string;
        subject: string | null;
        read: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        message: string;
        subject: string | null;
        read: boolean;
    }>;
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactClient<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        message: string;
        subject: string | null;
        read: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateContactDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        message: string;
        subject: string | null;
        read: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
