import { IsEnum, IsOptional } from 'class-validator';
import { Sort, Status } from '../../types/index.type';

class StatusDto {
  @IsEnum(Status, {
    message: `Status should be ${Status.PENDING}, ${Status.INPROGRESS}, ${Status.RESOLVED}, ${Status.REJECTED}!`,
  })
  readonly status: Status;
}

class StatusAndSortDto {
  @IsOptional()
  @IsEnum(Status, {
    message: `Status should be ${Status.PENDING}, ${Status.INPROGRESS}, ${Status.RESOLVED}, ${Status.REJECTED}!`,
  })
  readonly status: Status;

  @IsOptional()
  @IsEnum(Sort, {
    message: `Sorting by ${Sort.ASC} or ${Sort.DESC}!`,
  })
  readonly sort: Sort;
}

export { StatusDto, StatusAndSortDto };
