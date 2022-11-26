import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('user') private readonly userModel: Model<User>
  ) {}

  async signup(body: SignUpDto) {
    const { firstName, lastName, email, password, isAdmin, isVIP } = body;

    const checkEmail = await this.userModel.findOne({ email });

    if (checkEmail)
      throw new ConflictException('User with such email already exist');

    const hashedPassword: string = await this.hashData(password);

    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin,
      isVIP,
    });

    return user;
  }

  async signin(body: SignInDto) {
    const { email, password } = body;
    const checkEmail = await this.userModel.findOne({ email });

    if (!checkEmail) throw new ForbiddenException('Credentials incorrect');

    const isMatch = await bcrypt.compare(password, checkEmail.password);

    if (!isMatch) throw new ForbiddenException('Credentials incorrect');

    const payload = { id: checkEmail.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data, salt);

    return hash;
  }
}
