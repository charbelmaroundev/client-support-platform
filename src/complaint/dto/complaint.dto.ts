import { Expose, Transform } from 'class-transformer';
import { Status } from 'src/types/index.type';

@Expose()
export class ComplaintDto {
  @Expose()
  @Transform(
    (title) => title.value.charAt(0).toUpperCase() + title.value.slice(1)
  )
  readonly title: string;

  @Expose()
  @Transform((body) => body.value.charAt(0).toUpperCase() + body.value.slice(1))
  readonly body: string;

  @Expose()
  @Transform((status) => status.value.toUpperCase())
  readonly status: Status;
}
