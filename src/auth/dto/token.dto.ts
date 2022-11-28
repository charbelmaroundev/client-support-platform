import { Expose } from 'class-transformer';

export class TokenDto {
  @Expose()
  readonly access_token: string;
}
