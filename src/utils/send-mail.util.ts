import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { capitalize } from 'src/utils/capitalize.util';
import { Options } from '../types/index.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(user: User, options: Options) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Client Support Platform" <client-support-platform.io>',
      subject: options.subject,
      text: `Hello Dear ${capitalize(user.firstName)},\n\n${options.text}.`,
    });
  }
}
