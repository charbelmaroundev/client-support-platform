import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Status } from 'src/types/index.type';

@Schema({ timestamps: true })
class Complaint extends Document {
  @Prop({ required: true, minlength: 3, lowercase: true })
  readonly title: string;

  @Prop({ required: true, minlength: 3, lowercase: true })
  readonly body: string;

  @Prop({ default: Status.PENDING })
  readonly status: Status;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  readonly creator: User;
}

const ComplaintSchema = SchemaFactory.createForClass(Complaint);

ComplaintSchema.index({ status: 1 });

export { Complaint, ComplaintSchema };
