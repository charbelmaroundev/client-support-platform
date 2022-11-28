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
import { UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('user') private readonly userModel: Model<User>
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

    const checkEmail: User | null = await this.checkUserByEmail(email);

    if (checkEmail)
      throw new ConflictException('User with such email already exist');

    const hashedPassword: string = await this.hashData(password);

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

  async signin(body: SignInDto): Promise<TokenDto> {
    const { email, password }: { email: string; password: string } = body;
    const checkEmail: User | null = await this.checkUserByEmail(email);

    if (!checkEmail) this.CredentialIncorrect();

    const isMatch: boolean = await bcrypt.compare(
      password,
      checkEmail.password
    );

    if (!isMatch) this.CredentialIncorrect();

    const payload: object = { id: checkEmail.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async whoami(id: string): Promise<User> {
    const user: User = await this.checkUser(id);

    return user;
  }

  CredentialIncorrect() {
    throw new ForbiddenException('Credentials incorrect');
  }

  async hashData(data: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(data, salt);

    return hash;
  }

  async checkUser(id: string): Promise<User> {
    const user: User = await this.userModel.findById(id);

    if (!user) throw new UnauthorizedException();

    return user;
  }

  async checkUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    return user;
  }
}
