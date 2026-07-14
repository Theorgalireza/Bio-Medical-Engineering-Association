import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LinkedinAuthGuard extends AuthGuard('linkedin') {
  getAuthenticateOptions() {
    return {
      scope: ['r_liteprofile', 'r_emailaddress'],
    };
  }
}