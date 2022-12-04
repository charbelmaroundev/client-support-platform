import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/types/index.type';
import { UserService } from 'src/user/user.service';

const secretOrKey =
  process.env.SECRET_KEY_JWT || 'n2r5u8x/A?D(G+KbPeShVmYq3s6v9y$B';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    const id: string = payload.id;

    await this.userService.checkUserById(id);

    return { id };
  }
}
