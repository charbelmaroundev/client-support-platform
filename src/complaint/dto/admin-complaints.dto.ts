import { Expose, Transform, Type } from 'class-transformer';
import { Status } from '../../types/index.type';
import { UserDto } from '../../auth/dto/user.dto';
import { capitalize } from 'src/utils/capitalize.util';

class AdminComplaintsDto {
  @Expose()
  @Type(() => ComplaintWithUserDto)
  vip: ComplaintWithUserDto[];

  @Expose()
  @Type(() => ComplaintWithUserDto)
  nonVip: ComplaintWithUserDto[];
}

@Expose()
class ComplaintWithUserDto {
  @Expose()
  @Transform((title) => capitalize(title.value))
  readonly title: string;

  @Expose()
  @Transform((body) => capitalize(body.value))
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

export { AdminComplaintsDto, ComplaintWithUserDto };
