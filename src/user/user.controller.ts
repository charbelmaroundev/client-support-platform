import {
  Controller,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { AdminGuard } from '../guards/admin-role-guard';
import { MethodDto } from './dto/update-user.dto';
import { ObjectIdDto } from '../complaint/dto/objectId.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  @HttpCode(204)
  @UseGuards(AdminGuard)
  downgradeUser(
    @CurrentUser() adminId: User,
    @Param() id: ObjectIdDto,
    @Query() method: MethodDto
  ) {
    return this.userService.updateVip(adminId.id, id.id, method.method);
  }
}
