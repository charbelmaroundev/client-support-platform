import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './schemas/user.schema';
import { Serialize } from '../interceptor/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { WhoAmIDto } from './dto/who-am-i.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @Serialize(UserDto)
  signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  @Serialize(UserDto)
  signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @Get('me')
  @Serialize(WhoAmIDto)
  whoami(@CurrentUser() user: User) {
    return this.authService.whoami(user.id);
  }
}
