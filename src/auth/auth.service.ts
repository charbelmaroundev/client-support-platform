import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async signup(body: SignUpDto) {
    const { firstName, lastName, email, password } = body;
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password,
    });

    return user;
  }
}
