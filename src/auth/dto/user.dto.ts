import { Expose, Transform } from 'class-transformer';
import { capitalize } from '../../utils/capitalize.util';

export class UserDto {
  @Expose()

  //* capitalize first name
  @Transform((firstName) => capitalize(firstName.value))
  readonly firstName: string;

  //* capitalize last name
  @Expose()
  @Transform((lastName) => capitalize(lastName.value))
  readonly lastName: string;

  //* transform email to lower case
  @Expose()
  @Transform((email) => email.value.toLowerCase())
  readonly email: string;
}
