import { Expose, Type } from 'class-transformer';
import { WhoAmIDto } from '../../auth/dto/who-am-i.dto';
import { User } from 'src/user/schemas/user.schema';

export class SearchDto {
  @Expose()
  readonly total: number;

  @Expose()
  @Type(() => WhoAmIDto)
  readonly users: WhoAmIDto[];
}
