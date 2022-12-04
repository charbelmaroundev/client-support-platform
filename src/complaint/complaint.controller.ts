import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintDto } from './dto/complaint.dto';
import { User } from 'src/user/schemas/user.schema';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { ComplaintsDto } from './dto/complaints.dto';
import { ObjectIdDto } from './dto/objectId.dto';
import { StatusDto, StatusAndSortDto } from './dto/status.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AdminComplaintsDto } from './dto/admin-complaints.dto';
import { Complaint } from './schemas/complaint.schema';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @Roles(false)
  @UseGuards(RolesGuard)
  @Serialize(ComplaintDto)
  create(
    @Body() createComplaintDto: CreateComplaintDto,
    @CurrentUser() user: User
  ): Promise<Complaint> {
    return this.complaintService.create(createComplaintDto, user.id);
  }

  @Get()
  @Roles(false)
  @UseGuards(RolesGuard)
  @Serialize(ComplaintsDto)
  findAllByUserId(
    @Query() pagination,
    @CurrentUser() user: User
  ): Promise<ComplaintsDto> {
    return this.complaintService.findAllByUserId(
      user.id,
      parseInt(pagination.page),
      parseInt(pagination.limit)
    );
  }

  @Get('admin')
  @Roles(true)
  @UseGuards(RolesGuard)
  @Serialize(AdminComplaintsDto)
  findAll(@Query() query: StatusAndSortDto): Promise<Object> {
    return this.complaintService.findAll(query);
  }

  @Patch(':id')
  @Roles(true)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param() param: ObjectIdDto,
    @Body() updateComplaintDto: StatusDto
  ): Promise<void> {
    return this.complaintService.update(param.id, updateComplaintDto);
  }
}
