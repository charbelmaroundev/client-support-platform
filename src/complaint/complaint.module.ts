import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintSchema } from './schemas/complaint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'complaint', schema: ComplaintSchema }]),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
