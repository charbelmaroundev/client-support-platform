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

@Schema({ timestamps: true })
export class Complaint extends Document {
  @Prop({ required: true, minlength: 3 })
  readonly title: string;

  @Prop({ required: true, minlength: 3 })
  readonly body: string;

  @Prop({ default: Status.PENDING })
  readonly status: Status;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'user' })
  readonly creator: User;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

ComplaintSchema.index({ status: 1 });
