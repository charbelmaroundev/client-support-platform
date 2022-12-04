import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { MethodDto } from './dto/update-user.dto';
import { ObjectIdDto } from '../complaint/dto/objectId.dto';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { SearchDto } from './dto/search.dto.';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  @HttpCode(204)
  @Roles(true)
  @UseGuards(RolesGuard)
  downgradeUser(
    @CurrentUser() adminId: User,
    @Param() id: ObjectIdDto,
    @Query() method: MethodDto
  ) {
    this.userService.updateVip(adminId.id, id.id, method.method);
  }

  @Get(':name')
  @Serialize(SearchDto)
  @Roles(true)
  @UseGuards(RolesGuard)
  searchByName(@Param('name') name: any) {
    return this.userService.searchByName(name);
  }
}
