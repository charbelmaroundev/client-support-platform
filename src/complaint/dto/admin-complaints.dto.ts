import { Expose, Transform, Type } from 'class-transformer';
import { Status } from '../../types/index.type';
import { UserDto } from '../../auth/dto/user.dto';

export class AdminComplaintsDto {
  @Expose()
  @Type(() => ComplaintWithUserDto)
  vip: ComplaintWithUserDto[];

  @Expose()
  @Type(() => ComplaintWithUserDto)
  nonVip: ComplaintWithUserDto[];
}

@Expose()
export class ComplaintWithUserDto {
  @Expose()
  @Transform(
    (title) => title.value.charAt(0).toUpperCase() + title.value.slice(1)
  )
  readonly title: string;

  @Expose()
  @Transform((body) => body.value.charAt(0).toUpperCase() + body.value.slice(1))
  readonly body: string;

  @Expose()
  readonly createdDate: Date;

  @Expose()
  @Transform((status) => status.value.toUpperCase())
  readonly status: Status;

  @Expose()
  @Type(() => UserDto)
  readonly user: UserDto;
}
