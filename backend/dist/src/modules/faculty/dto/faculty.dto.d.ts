export declare class CreateFacultyDto {
    name: string;
    title: string;
    specialties: string[];
    monogram: string;
    color: string;
    isActive?: boolean;
}
export declare class UpdateFacultyDto {
    name?: string;
    title?: string;
    specialties?: string[];
    monogram?: string;
    color?: string;
    isActive?: boolean;
}
export declare class QueryFacultyDto {
    isActive?: boolean;
    search?: string;
}
