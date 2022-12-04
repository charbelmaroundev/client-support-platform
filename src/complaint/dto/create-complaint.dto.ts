import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly body: string;
}
