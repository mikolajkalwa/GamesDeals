import { IsString, IsNumberString } from 'class-validator';
import PatchWebhookDto from './patch-webhook.dto';

export default class CreateWebhookDto extends PatchWebhookDto {
  @IsNumberString()
  readonly id: string;

  @IsString()
  readonly token: string;

  @IsNumberString()
  readonly guild: string;

  @IsNumberString()
  readonly channel: string;
}
