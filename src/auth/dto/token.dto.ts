import { Expose } from 'class-transformer';

export class TokenDto {
  @Expose()
  access_token: string;
}
