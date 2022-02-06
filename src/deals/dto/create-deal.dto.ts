import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export default class CreateDealDto {
  @IsString()
  @IsNotEmpty()
  readonly redditId: string;

  @IsString()
  @IsNotEmpty()
  readonly redditTitle: string;

  @IsUrl()
  readonly gameUrl: string;
}
