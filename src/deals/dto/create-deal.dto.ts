import { IsString } from 'class-validator';

export default class CreateDealDto {
  @IsString()
  readonly redditId: string;

  @IsString()
  readonly redditTitle: string;

  @IsString()
  readonly gameUrl: string;
}
