import {
  IsString, IsOptional, Length, ArrayMaxSize,
} from 'class-validator';

export default class PatchWebhookDto {
  @IsOptional()
  @IsString()
  readonly roleToMention?: string;

  @IsOptional()
  @IsString({ each: true })
  @Length(3, 32, { each: true })
  @ArrayMaxSize(5)
  readonly keywords?: [string];
}
