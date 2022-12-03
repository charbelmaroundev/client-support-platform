import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/utils/send-mail.util';
import { capitalize } from 'src/utils/capitalize.util';
import { Options, UpDowngrade, VipNonVip } from '../types/index.type';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly mailService: MailService,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

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

  //* Up and Down grade client to vip and non vip
  async updateVip(
    adminId: User,
    clientId: Object,
    method: Object
  ): Promise<void> {
    const admin: User = await this.checkUserById(adminId.toString());
    const client: User = await this.userModel.findOne({ _id: clientId });

    if (!client) {
      throw new NotFoundException(`Client not found with this id ${clientId}!`);
    }

    if (client.isAdmin) {
      throw new BadRequestException(
        `User with this id ${clientId} is an admin!`
      );
    }

    let vip: boolean;
    let text: VipNonVip;
    let UpDown: UpDowngrade;

    if (method === 'upgrade') {
      vip = true;
      text = VipNonVip.VIP;
      UpDown = UpDowngrade.UPGRADE;
    } else if (method === 'downgrade') {
      vip = false;
      text = VipNonVip.NONVIP;
      UpDown = UpDowngrade.DOWNGRADE;
    }

    if (client.isVIP === vip)
      throw new BadRequestException(
        `Client with this id ${clientId} is ${text} you can't ${UpDown}!`
      );

    await this.userModel.updateOne({ _id: clientId }, { $set: { isVIP: vip } });

    const options: Options = {
      subject: `${capitalize(UpDown.toString())} account`,
      text: `Your account is ${capitalize(
        UpDown.toString()
      )}d to ${text} by ${capitalize(admin.firstName)}`,
    };

    // its is better to not use await here
    this.mailService.sendEmail(client, options);
  }

  async searchByName(name: any) {
    const users = await this.userModel.find({
      $text: {
        $search: `/${name}/i`,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    });

    return { total: users.length, users };
  }
}
