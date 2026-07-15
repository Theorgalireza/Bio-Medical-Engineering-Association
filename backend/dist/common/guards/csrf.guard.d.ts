import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
export declare class CsrfGuard implements CanActivate {
    private readonly reflector;
    private readonly httpAdapterHost;
    constructor(reflector: Reflector, httpAdapterHost: HttpAdapterHost);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
