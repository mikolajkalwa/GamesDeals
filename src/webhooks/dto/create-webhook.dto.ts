import {
  IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString,
} from 'class-validator';
import PatchWebhookDto from './patch-webhook.dto';

const channelTypes = ['GUILD_TEXT', 'GUILD_FORUM'] as const;
type ChannelType = typeof channelTypes[number];

export default class CreateWebhookDto extends PatchWebhookDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsNotEmpty()
  readonly token!: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly guild!: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly channel!: string;

  @IsIn(channelTypes)
  @IsOptional()
  readonly channelType: ChannelType = 'GUILD_TEXT';
}
