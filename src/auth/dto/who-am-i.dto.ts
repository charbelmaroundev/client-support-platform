import { Expose } from 'class-transformer';

export class WhoAmIDto {
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  isVIP: boolean;

  @Expose()
  isAdmin: boolean;
}
