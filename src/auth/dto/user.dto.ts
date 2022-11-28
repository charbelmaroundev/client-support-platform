import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly email: string;
}
