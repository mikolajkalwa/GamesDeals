import { IsNotEmpty, IsString } from 'class-validator';
import CreateDealDto from './create-deal.dto';

export default class AnnounceDealDto extends CreateDealDto {
  @IsString()
  @IsNotEmpty()
  readonly author!: string;
}
