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
  ParseArrayPipe,
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
import { ClientGuard } from '../guards/client-role.guards';
import { AdminGuard } from '../guards/admin-role-guard';
import { AdminComplaintsDto } from './dto/admin-complaints.dto';

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
  @Serialize(AdminComplaintsDto)
  @UseGuards(AdminGuard)
  findAll(@Query() query: StatusAndSortDto): Promise<Object> {
    return this.complaintService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param() param: ObjectIdDto,
    @Body() updateComplaintDto: StatusDto
  ): Promise<void> {
    return this.complaintService.update(param.id, updateComplaintDto);
  }
}
