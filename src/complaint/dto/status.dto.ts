import { IsEnum, IsOptional } from 'class-validator';
import { Sort, Status } from '../schemas/complaint.schema';

export class StatusDto {
  @IsEnum(Status, {
    message: `Status should be ${Status.INPROGRESS}, ${Status.PENDING}, ${Status.REJECTED}, ${Status.RESOLVED}!`,
  })
  status: Status;
}

export class StatusAndSortDto {
  @IsOptional()
  @IsEnum(Status, {
    message: `Status should be ${Status.INPROGRESS}, ${Status.PENDING}, ${Status.REJECTED}, ${Status.RESOLVED}!`,
  })
  status: Status;

  @IsOptional()
  @IsEnum(Sort, {
    message: `Status should be ${Sort.ASC}, ${Sort.DESC}!`,
  })
  sort: Status;
}
