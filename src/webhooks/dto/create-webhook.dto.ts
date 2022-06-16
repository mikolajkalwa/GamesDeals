import { IsString, IsNumberString, IsNotEmpty } from 'class-validator';
import PatchWebhookDto from './patch-webhook.dto';

export default class CreateWebhookDto extends PatchWebhookDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly guild: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly channel: string;
}
