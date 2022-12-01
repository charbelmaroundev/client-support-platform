import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class WhoAmIDto {
  @Expose()
  readonly id: ObjectId;

  @Expose()
  @Transform(
    (firstName) =>
      firstName.value.charAt(0).toUpperCase() + firstName.value.slice(1)
  )
  readonly firstName: string;

  @Expose()
  @Transform(
    (lastName) =>
      lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1)
  )
  readonly lastName: string;

  @Expose()
  @Transform((email) => email.value.toLowerCase())
  readonly email: string;

  @Expose()
  readonly isAdmin: boolean;

  @Expose()
  readonly isVIP: boolean;
}
