import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  //* Check user by Id
  async checkUserById(id: string): Promise<User> {
    const user: User = await this.userModel.findById(id);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  //* Check user by Email
  async checkUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    return user;
  }
}
