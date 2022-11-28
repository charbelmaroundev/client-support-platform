import { Expose, Type } from 'class-transformer';
import { ComplaintDto } from './complaint.dto';

export class ComplaintsDto {
  @Expose()
  readonly total: number;

  @Expose()
  @Type(() => ComplaintDto)
  readonly complaints: [ComplaintDto];
}
