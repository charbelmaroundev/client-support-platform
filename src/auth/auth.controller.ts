import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { Serialize } from '../interceptor/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { WhoAmIDto } from './dto/who-am-i.dto';
import { AccessToken } from '../types/index.type';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ObjectId } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @Serialize(UserDto)
  signup(@Body() body: SignUpDto): Promise<User> {
    return this.authService.signup(body);
  }

  @Public()
  @HttpCode(200)
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@CurrentUser() user: ObjectId): Promise<AccessToken> {
    return this.authService.signin(user);
  }

  @Get('me')
  @Serialize(WhoAmIDto)
  whoami(@CurrentUser() user: User): Promise<User> {
    return this.authService.whoami(user.id);
  }
}
