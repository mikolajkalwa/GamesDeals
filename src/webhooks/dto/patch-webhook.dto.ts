import {
  IsString, IsOptional, Length, ArrayMaxSize,
} from 'class-validator';

export default class PatchWebhookDto {
  @IsOptional()
  @IsString()
  readonly mention?: string;

  @IsOptional()
  @IsString({ each: true })
  @Length(3, 300, { each: true })
  @ArrayMaxSize(30)
  readonly keywords?: [string];

  @IsOptional()
  @IsString({ each: true })
  @Length(3, 300, { each: true })
  @ArrayMaxSize(30)
  readonly blacklist?: [string];
}
