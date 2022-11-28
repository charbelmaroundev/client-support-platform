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

  async findAllByUserId(id: ObjectId): Promise<ComplaintsDto | Object> {
    const complaints: Complaint[] = await this.complaintModel.find({
      creator: id,
    });

    if (!complaints.length) return { message: 'Complaint not found' };

    return { total: complaints.length, complaints };
  }

  async findAll(query: StatusAndSortDto): Promise<Object> {
    console.log(query);

    const { status, sort }: { status: Status; sort: Sort } = query;

    let sortBy: number | undefined;
    if (!sort) sortBy = 1;
    if (sort) sortBy = sort.toString() === 'ASC' ? 1 : -1;

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

    if (!complaint.length) return { message: 'Complaint not found' };

    let complaints: Object;
    if (complaint[0]._id === true) {
      complaints = { vip: complaint[0]?.data, nonVip: complaint[1]?.data };
    } else {
      complaints = { vip: complaint[1]?.data, nonVip: complaint[0]?.data };
    }

    return complaints;
  }

  // // findOne(id: number) {
  // //   return `This action returns a #${id} complaint`;
  // // }
}
