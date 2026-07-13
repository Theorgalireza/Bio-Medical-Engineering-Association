declare const _default: (() => {
    port: number;
    jwtSecret: string;
    jwtExpiresIn: string;
    frontendUrl: string;
    smsProvider: string;
    smsApiKey: string;
    smsSender: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    jwtSecret: string;
    jwtExpiresIn: string;
    frontendUrl: string;
    smsProvider: string;
    smsApiKey: string;
    smsSender: string;
}>;
export default _default;
