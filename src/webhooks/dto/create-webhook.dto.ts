import { IsString } from 'class-validator';
import PatchWebhookDto from './patch-webhook.dto';

export default class CreateWebhookDto extends PatchWebhookDto {
  @IsString()
  readonly webhookId: string;

  @IsString()
  readonly webhookToken: string;

  @IsString()
  readonly guildId: string;
}
