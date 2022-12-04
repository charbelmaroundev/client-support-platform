import { Expose, Transform } from 'class-transformer';
import { Status } from 'src/types/index.type';
import { capitalize } from '../../utils/capitalize.util';

@Expose()
export class ComplaintDto {
  @Expose()
  @Transform((title) => capitalize(title.value))
  readonly title: string;

  @Expose()
  @Transform((body) => capitalize(body.value))
  readonly body: string;

  @Expose()
  @Transform((status) => status.value.toUpperCase())
  readonly status: Status;
}
