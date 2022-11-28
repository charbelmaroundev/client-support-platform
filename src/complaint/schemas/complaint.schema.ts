import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export enum Status {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Schema()
export class Complaint extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: Date.now() })
  createdDate: Date;

  @Prop({ default: Status.PENDING })
  status: Status;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'user' })
  creator: User;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
