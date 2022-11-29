import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let user = request.user;

    user = await this.userService.checkUserById(user.id);

    if (user.isAdmin === false) return true;

    throw new HttpException('UNAUTHORIZED ACCESS', HttpStatus.FORBIDDEN);
  }
}
