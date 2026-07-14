export declare class CreateGalleryDto {
    title: string;
    description?: string;
    imageUrl: string;
    category?: string;
}
export declare class UpdateGalleryDto {
    title?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
}
export declare class QueryGalleryDto {
    category?: string;
    search?: string;
}
