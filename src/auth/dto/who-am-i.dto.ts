import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { capitalize } from '../../utils/capitalize.util';

export class WhoAmIDto {
  @Expose()
  readonly id: ObjectId;

  @Expose()
  @Transform((firstName) => capitalize(firstName.value))
  readonly firstName: string;

  @Expose()
  @Transform((lastName) => capitalize(lastName.value))
  readonly lastName: string;

  @Expose()
  @Transform((email) => email.value.toLowerCase())
  readonly email: string;

  @Expose()
  readonly isAdmin: boolean;

  @Expose()
  readonly isVIP: boolean;
}
