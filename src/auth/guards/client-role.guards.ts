import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let user = request.user;

    user = await this.authService.checkUser(user.id);

    if (user.isAdmin === false) return true;

    throw new HttpException('UNAUTHORIZED ACCESS', HttpStatus.UNAUTHORIZED);
  }
}
