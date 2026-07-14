declare const LinkedinAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LinkedinAuthGuard extends LinkedinAuthGuard_base {
    getAuthenticateOptions(): {
        scope: string[];
    };
}
export {};
