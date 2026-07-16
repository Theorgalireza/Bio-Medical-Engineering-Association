import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // این خط قبلاً وجود نداشت — علت واقعی را چاپ می‌کند
    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );

    const rawMessage = exception instanceof HttpException ? exception.getResponse() : null;
    const message = rawMessage
      ? (typeof rawMessage === 'object' ? (rawMessage as any).message : rawMessage)
      : 'Internal server error';

    reply.status(status).send({ success: false, statusCode: status, message, timestamp: new Date().toISOString() });
  }
}
