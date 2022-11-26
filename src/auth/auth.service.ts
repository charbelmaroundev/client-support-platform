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
}
