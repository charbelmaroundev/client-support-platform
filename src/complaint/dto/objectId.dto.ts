import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class ObjectIdDto {
  @IsObjectId({ message: 'Param should be an objectId' })
  readonly id: ObjectId;
}
