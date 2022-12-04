import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { hashData } from '../utils/hash-data..util';
import { UserService } from '../user/user.service';
import { Payload } from 'src/types/index.type';
import { AccessToken } from 'src/types/index.type';
import { MailService } from 'src/utils/send-mail.util';
import { Options } from '../types/index.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  //* Sign up
  async signup(body: SignUpDto): Promise<User> {
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

    // check email
    const checkEmail: User | null = await this.userService.checkUserByEmail(
      email
    );

    if (checkEmail)
      throw new ConflictException(
        `User with this email ${email.toLowerCase()} is already exist`
      );

    // hash password
    const hashedPassword: string = await hashData(password);

    // create user
    const user: User = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin,
      isVIP,
    });

    if (isAdmin === false) {
      const options: Options = {
        subject: `It's great to have you at Client Support Platform`,
        text: `Thank you for purchasing client-support-platform`,
      };

      // its is better to not use await here
      this.mailService.sendEmail(user, options);
    }

    return user;
  }

  //* Validate user
  async validateUser(email: string, password: string): Promise<User> {
    const checkEmail: User | null = await this.userService.checkUserByEmail(
      email
    );

    if (!checkEmail) {
      this.CredentialIncorrect();
    }

    const isMatch: boolean = await bcrypt.compare(
      password,
      checkEmail.password
    );

    if (!isMatch) {
      this.CredentialIncorrect();
    }
    return checkEmail;
  }

  //* Sign in
  async signin(user: ObjectId): Promise<AccessToken> {
    const checkUser: User = await this.userService.checkUserById(
      user.toString()
    );

    const payload: Payload = { id: checkUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //* Who am i
  // for testing
  async whoami(id: string): Promise<User> {
    const user: User = await this.userService.checkUserById(id);

    return user;
  }

  //* throw credentials incorrect error
  CredentialIncorrect() {
    throw new ForbiddenException('Incorrect credentials!');
  }
}
