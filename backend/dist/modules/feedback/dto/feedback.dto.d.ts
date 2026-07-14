export declare class CreateFeedbackDto {
    name: string;
    message: string;
    rating?: number;
}
export declare class UpdateFeedbackDto {
    approved?: boolean;
}
export declare class QueryFeedbackDto {
    approved?: boolean;
    search?: string;
}
