import { Controller, Get, Res } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class CsrfController {
  @Public()
  @Get('csrf-token')
  async csrfToken(@Res() reply: any) {
    const csrfToken = await reply.generateCsrf();
    return reply.send({ csrfToken });
  }
}
