import { Expose, Type } from 'class-transformer';
import { WhoAmIDto } from '../../auth/dto/who-am-i.dto';

export class SearchDto {
  @Expose()
  readonly total: number;

  @Expose()
  @Type(() => WhoAmIDto)
  readonly users: WhoAmIDto[];
}
