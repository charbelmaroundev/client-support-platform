import { Expose } from 'class-transformer';
import { Status } from '../schemas/complaint.schema';

@Expose()
export class ComplaintDto {
  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: Status;
}
