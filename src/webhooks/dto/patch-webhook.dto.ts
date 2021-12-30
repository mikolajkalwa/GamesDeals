import {
  IsString, IsOptional, Length, ArrayMaxSize, IsNumberString,
} from 'class-validator';

export default class PatchWebhookDto {
  @IsOptional()
  @IsNumberString()
  readonly role?: string;

  @IsOptional()
  @IsString({ each: true })
  @Length(3, 300, { each: true })
  @ArrayMaxSize(100)
  readonly keywords?: [string];

  @IsOptional()
  @IsString({ each: true })
  @Length(3, 300, { each: true })
  @ArrayMaxSize(100)
  readonly blacklist?: [string];
}
