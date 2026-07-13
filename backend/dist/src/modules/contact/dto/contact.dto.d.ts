export declare class CreateContactDto {
    name: string;
    email: string;
    subject?: string;
    message: string;
}
export declare class UpdateContactDto {
    read?: boolean;
}
export declare class QueryContactDto {
    read?: boolean;
    search?: string;
}
