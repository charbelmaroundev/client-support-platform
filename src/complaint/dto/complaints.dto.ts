import { Expose, Type } from 'class-transformer';
import { ComplaintDto } from './complaint.dto';

export class ComplaintsDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => ComplaintDto)
  complaints: [ComplaintDto];
}
