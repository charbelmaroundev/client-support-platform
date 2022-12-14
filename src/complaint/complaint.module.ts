import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintSchema } from './schemas/complaint.schema';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MailService } from '../utils/send-mail.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Complaint', schema: ComplaintSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService, MailService],
})
export class ComplaintModule {}
