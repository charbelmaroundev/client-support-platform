import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint } from './schemas/complaint.schema';
import { Status } from 'src/types/index.type';
import { StatusDto, StatusAndSortDto } from './dto/status.dto';
import { ComplaintsDto } from './dto/complaints.dto';
import { MailService } from 'src/utils/send-mail.util';
import { Options } from '../types/index.type';
import { UserService } from '../user/user.service';
import { capitalize } from 'src/utils/capitalize.util';

@Injectable()
export class ComplaintService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @InjectModel('Complaint') private readonly complaintModel: Model<Complaint>
  ) {}

  //* Create a complaint
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

    const user = await this.userService.checkUserById(id.toString());

    const options: Options = {
      subject: `Complaint Received`,
      text: `Thank you for letting us know about ${capitalize(
        title
      )}, well noted`,
    };

    // its is better to not use await here
    this.mailService.sendEmail(user, options);

    return complaint;
  }

  //* Get all complaint for current user with simple pagination
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

    // if (!complaints.length) throw new NotFoundException('Complaint not found');

    return { total: complaints.length, complaints };
  }

  //* Get all complaints for admin user type with filtring by status and sorting by creation date
  async findAll(query: StatusAndSortDto): Promise<Object> {
    const { status, sort }: StatusAndSortDto = query;

    let sortBy: number | undefined;
    if (!sort) sortBy = 1;
    if (sort) sortBy = sort.toString() === 'asc' ? 1 : -1;

    // Stages
    const stages: any[] = [
      {
        $match: {
          ...(status ? { status } : {}),
        },
      },
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
        $project: {
          _id: 0,
          title: 1,
          body: 1,
          createdDate: {
            $dateToString: {
              format: '%Y-%m-%dT%H:%M:%S',
              date: '$createdAt',
            },
          },
          status: 1,
          'user.firstName': 1,
          'user.lastName': 1,
          'user.email': 1,
          'user.isVIP': 1,
        },
      },

      {
        $sort: {
          createdDate: sortBy,
        },
      },

      {
        $group: {
          _id: null,
          vip: {
            $push: {
              $cond: [
                {
                  $eq: ['$user.isVIP', true],
                },
                '$$ROOT',
                '$$REMOVE',
              ],
            },
          },
          nonVip: {
            $push: {
              $cond: [
                {
                  $eq: ['$user.isVIP', false],
                },
                '$$ROOT',
                '$$REMOVE',
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          'vip.user.isVIP': 0,
          'nonVip.user.isVIP': 0,
        },
      },
    ];

    const complaint = await this.complaintModel.aggregate(stages);

    return complaint[0];
  }

  //* Update status by id
  async update(id: ObjectId, updateComplaintDto: StatusDto): Promise<void> {
    const { status }: { status: Status } = updateComplaintDto;
    await this.checkComplaint(id);

    await this.complaintModel.updateOne({ _id: id }, { $set: { status } });

    const complaint = await this.checkComplaint(id);

    const user = await this.userService.checkUserById(
      complaint.creator.toString()
    );

    const options: Options = {
      subject: `Complaint Status`,
      text: `Your complaint about ${capitalize(complaint.title)} is ${status}`,
    };

    // its is better to not use await here
    this.mailService.sendEmail(user, options);
  }

  //* Check complaint
  async checkComplaint(id: ObjectId): Promise<Complaint> {
    const complaint: Complaint = await this.complaintModel.findById(id);

    if (!complaint)
      throw new NotFoundException(`Complaint with this id ${id} not found`);

    return complaint;
  }
}
