import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { SKIP_CSRF_KEY } from '../decorators/skip-csrf.decorator';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reply = context.switchToHttp().getResponse();

    if (
      process.env.NODE_ENV === 'test' ||
      process.env.JEST_WORKER_ID !== undefined ||
      SAFE_METHODS.has(String(request.method ?? '').toUpperCase())
    ) {
      return true;
    }

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const adapter = this.httpAdapterHost.httpAdapter as any;
    const fastify = typeof adapter.getInstance === 'function' ? adapter.getInstance() : adapter;
    const csrfProtection = fastify?.csrfProtection;

    if (typeof csrfProtection !== 'function') {
      throw new ForbiddenException('CSRF protection is unavailable');
    }

    return new Promise<boolean>((resolve, reject) => {
      csrfProtection(request, reply, (err: unknown) => {
        if (err) {
          reject(new ForbiddenException('Invalid CSRF token'));
          return;
        }
        resolve(true);
      });
    });
  }
}
