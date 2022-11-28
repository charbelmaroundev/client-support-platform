import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class WhoAmIDto {
  @Expose()
  readonly id: ObjectId;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly isVIP: boolean;

  @Expose()
  readonly isAdmin: boolean;
}
