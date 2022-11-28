import {
  ArrayMaxSize,
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export default class PatchWebhookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly mention?: string;

  @IsOptional()
  @IsString({ each: true })
  @Length(3, 300, { each: true })
  @ArrayMaxSize(30)
  @ArrayUnique()
  readonly keywords?: [string];

  @IsOptional()
  @IsString({ each: true })
  @Length(3, 300, { each: true })
  @ArrayMaxSize(30)
  @ArrayUnique()
  readonly blacklist?: [string];
}
