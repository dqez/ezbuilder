import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // handleRequest(err: any, user: any) {
  //   if (err || !user) throw err || new UnauthorizedException();
  //   return user;
  // }
}
//note: because AuthGuard implemented CanActive, you don't need to implement CanActive anymore, just extend AuthGuard('jwt)
