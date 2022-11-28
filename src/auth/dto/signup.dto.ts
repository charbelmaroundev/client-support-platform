import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @MinLength(8)
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password: string;

  @IsOptional()
  @IsBoolean()
  readonly isVIP: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isAdmin: boolean;
}
