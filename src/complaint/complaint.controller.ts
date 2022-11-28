import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Next,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintDto } from './dto/complaint.dto';
import { User } from 'src/user/schemas/user.schema';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { ComplaintsDto } from './dto/complaints.dto';
import { ObjectIdDto } from './dto/objectId.dto';
import { StatusDto, StatusAndSortDto } from './dto/status.dto';
import { ClientGuard } from '../auth/guards/client-role.guards';
import { AdminGuard } from '../auth/guards/admin-role-guard';
import { Complaint } from './schemas/complaint.schema';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @Serialize(ComplaintDto)
  @UseGuards(ClientGuard)
  create(
    @Body() createComplaintDto: CreateComplaintDto,
    @CurrentUser() user: User
  ): Promise<ComplaintDto> {
    return this.complaintService.create(createComplaintDto, user.id);
  }

  @Get()
  @Serialize(ComplaintsDto)
  @UseGuards(ClientGuard)
  findAllByUserId(@CurrentUser() user: User): Promise<ComplaintsDto | Object> {
    return this.complaintService.findAllByUserId(user.id);
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  findAll(@Query() query: StatusAndSortDto): Promise<Object> {
    return this.complaintService.findAll(query);
  }

  @Patch(':id')
  @HttpCode(204)
  @UseGuards(AdminGuard)
  update(
    @Param() param: ObjectIdDto,
    @Body() updateComplaintDto: StatusDto
  ): Promise<void> {
    return this.complaintService.update(param.id, updateComplaintDto);
  }

  // // @Get(':id')
  // // findOne(@Param('id') id: string) {
  // //   return this.complaintService.findOne(+id);
  // // }

  // // @Delete(':id')
  // // remove(@Param('id') id: string) {
  // //   return this.complaintService.remove(+id);
  // // }
}
