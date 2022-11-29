import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import { hashData } from '../utils/hash-data..util';
import { UserService } from '../user/user.service';
import { Payload } from 'src/types/index.type';
import { AccessToken } from 'src/types/index.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async signup(body: SignUpDto): Promise<UserDto> {
    const {
      firstName,
      lastName,
      email,
      password,
      isAdmin,
      isVIP,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      isAdmin: boolean;
      isVIP: boolean;
    } = body;

    const checkEmail: User | null = await this.userService.checkUserByEmail(
      email
    );

    if (checkEmail)
      throw new ConflictException('User with such email already exist');

    const hashedPassword: string = await hashData(password);

    const user: User = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin,
      isVIP,
    });

    return user;
  }

  async signin(body: SignInDto): Promise<AccessToken> {
    const { email, password }: { email: string; password: string } = body;
    const checkEmail: User | null = await this.userService.checkUserByEmail(
      email
    );

    if (!checkEmail) this.CredentialIncorrect();

    const isMatch: boolean = await bcrypt.compare(
      password,
      checkEmail.password
    );

    if (!isMatch) this.CredentialIncorrect();

    const payload: Payload = { id: checkEmail.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async whoami(id: string): Promise<User> {
    const user: User = await this.userService.checkUserById(id);

    return user;
  }

  CredentialIncorrect() {
    throw new ForbiddenException('Incorrect credentials!');
  }
}
