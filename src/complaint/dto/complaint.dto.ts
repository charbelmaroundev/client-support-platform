import { Expose } from 'class-transformer';
import { Status } from '../schemas/complaint.schema';

@Expose()
export class ComplaintDto {
  @Expose()
  readonly title: string;

  @Expose()
  readonly body: string;

  @Expose()
  readonly status: Status;
}
