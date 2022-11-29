import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ trim: true, required: true, lowercase: true })
  readonly firstName: string;

  @Prop({ trim: true, required: true, lowercase: true })
  readonly lastName: string;

  @Prop({ trim: true, unique: true, lowercase: true, required: true })
  readonly email: string;

  @Prop({
    trim: true,
    required: true,
    minlength: 8,
    match: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  })
  readonly password: string;

  @Prop({ default: false })
  readonly isAdmin: boolean;

  @Prop({ default: false })
  readonly isVIP: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
