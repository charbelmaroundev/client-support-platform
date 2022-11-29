import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()

  //* capitalize first name
  @Transform(
    (firstName) =>
      firstName.value.charAt(0).toUpperCase() + firstName.value.slice(1)
  )
  readonly firstName: string;

  //* capitalize last name
  @Expose()
  @Transform(
    (lastName) =>
      lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1)
  )
  readonly lastName: string;

  //* transform email to lower case
  @Expose()
  @Transform((email) => email.value.toLowerCase())
  readonly email: string;
}
