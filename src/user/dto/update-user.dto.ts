import { IsEnum } from 'class-validator';
import { UpDowngrade } from '../../types/index.type';

export class MethodDto {
  @IsEnum(UpDowngrade, {
    message: `Method should be ${UpDowngrade.UPGRADE} or ${UpDowngrade.DOWNGRADE}!`,
  })
  readonly method: UpDowngrade;
}
