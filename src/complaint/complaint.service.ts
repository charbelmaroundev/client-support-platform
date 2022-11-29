import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint } from './schemas/complaint.schema';
import { Status, Sort } from 'src/types/index.type';
import { StatusDto, StatusAndSortDto } from './dto/status.dto';
import { ComplaintsDto } from './dto/complaints.dto';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectModel('Complaint') private readonly complaintModel: Model<Complaint>
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

  async findAllByUserId(
    id: ObjectId,
    page: number,
    limit: number
  ): Promise<ComplaintsDto> {
    const offset: number = (page - 1) * limit;

    const complaints: Complaint[] = await this.complaintModel
      .find({
        creator: id,
      })
      .limit(limit)
      .skip(offset);

    if (!complaints.length) throw new NotFoundException('Complaint not found');

    return { total: complaints.length, complaints };
  }

  async findAll(query: StatusAndSortDto): Promise<Object> {
    console.log(query);

    const { status, sort }: { status: Status; sort: Sort } = query;

    let sortBy: number | undefined;
    if (!sort) sortBy = 1;
    if (sort) sortBy = sort.toString() === 'asc' ? 1 : -1;

    const stages: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                email: 1,
                isVIP: 1,
              },
            },
          ],
        },
      },

      { $unwind: '$user' },

      {
        $sort: {
          createdAt: sortBy,
        },
      },

      {
        $group: {
          _id: '$user.isVIP',
          data: {
            $push: {
              title: '$title',
              body: '$body',
              createdDate: {
                $dateToString: {
                  format: '%Y-%m-%dT%H:%M:%S',
                  date: '$createdAt',
                },
              },
              status: '$status',
              user: '$user',
            },
          },
        },
      },

      {
        $project: {
          'data.user.isVIP': 0,
        },
      },
    ];

    if (status) {
      stages.unshift({ $match: { status } });
    }

    const complaint = await this.complaintModel.aggregate(stages);

    if (!complaint.length) throw new NotFoundException('Complaint not found');

    let complaints: Object;
    if (complaint[0]._id === true) {
      complaints = { vip: complaint[0]?.data, nonVip: complaint[1]?.data };
    } else {
      complaints = { vip: complaint[1]?.data, nonVip: complaint[0]?.data };
    }

    return complaints;
  }

  async update(id: ObjectId, updateComplaintDto: StatusDto): Promise<void> {
    const { status }: { status: Status } = updateComplaintDto;
    await this.checkComplaint(id);

    await this.complaintModel.updateOne({ _id: id }, { $set: { status } });
  }

  async checkComplaint(id: ObjectId): Promise<Complaint> {
    const complaint: Complaint = await this.complaintModel.findById(id);

    if (!complaint) throw new NotFoundException('Complaint not found');

    return complaint;
  }
}
