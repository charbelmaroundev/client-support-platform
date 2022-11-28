import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ trim: true, required: true })
  firstName: string;

  @Prop({ trim: true, required: true })
  lastName: string;

  @Prop({ trim: true, unique: true, lowercase: true, required: true })
  email: string;

  @Prop({ trim: true, required: true, minlength: 8 })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isVIP: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
