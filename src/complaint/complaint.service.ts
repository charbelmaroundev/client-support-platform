import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint, Status, Sort } from './schemas/complaint.schema';
import { StatusDto, StatusAndSortDto } from './dto/status.dto';
import { ComplaintsDto } from './dto/complaints.dto';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectModel('complaint') private readonly complaintModel: Model<Complaint>
  ) {}

  async create(
    createComplaintDto: CreateComplaintDto,
    id: ObjectId
  ): Promise<Complaint> {
    const { title, body }: { title: string; body: Object } = createComplaintDto;

    const complaint: Complaint = await this.complaintModel.create({
      title,
      body,
      creator: id,
    });

    return complaint;
  }
}
