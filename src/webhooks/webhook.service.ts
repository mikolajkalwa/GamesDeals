import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateWebhookDto from './dto/create-webhook.dto';
import PatchWebhookDto from './dto/patch-webhook.dto';
import { Webhook } from './schemas/webhook.schema';

@Injectable()
export default class WebhookService {
  constructor(@InjectModel(Webhook.name) private readonly WebhookModel: Model<Webhook>) { }

  async create(webhook: CreateWebhookDto): Promise<Webhook> {
    const createdWebhook = new this.WebhookModel(webhook);
    return createdWebhook.save();
  }

  async count(): Promise<number> {
    const webhookCount = await this.WebhookModel.countDocuments({});
    return webhookCount;
  }

  async findMany(): Promise<Webhook[]> {
    return this.WebhookModel.find({});
  }

  async findByWebhookId(webhookId: string): Promise<Webhook> {
    const webhook = await this.WebhookModel.findOne({ webhookId });
    if (!webhook) {
      throw new NotFoundException('No webhook found.');
    }
    return webhook;
  }

  // an array is returned because in the future there might be many webhooks per guild
  async findByGuild(guildId: string): Promise<Webhook[]> {
    return this.WebhookModel.find({ guildId });
  }

  async delete(webhookId: string): Promise<null> {
    const deletedWebhook = await this.WebhookModel.findOneAndDelete({ webhookId });
    if (!deletedWebhook) {
      throw new NotFoundException('No webhook found.');
    }
    return null;
  }

  async patch(webhookId: string, webhookPatchData: PatchWebhookDto): Promise<Webhook> {
    if (
      webhookPatchData.keywords === undefined
      && webhookPatchData.blacklist === undefined
      && webhookPatchData.roleToMention === undefined) {
      throw new BadRequestException('No fields were provided to patch');
    }
    // mongoose will run $unset on fields with undefined value
    const webhookToPatch = await this.findByWebhookId(webhookId);
    if (webhookPatchData.keywords === null || webhookPatchData.keywords) {
      webhookToPatch.keywords = webhookPatchData.keywords || undefined;
    }
    if (webhookPatchData.blacklist === null || webhookPatchData.blacklist) {
      webhookToPatch.blacklist = webhookPatchData.blacklist || undefined;
    }
    if (webhookPatchData.roleToMention === null || webhookPatchData.roleToMention) {
      webhookToPatch.roleToMention = webhookPatchData.roleToMention || undefined;
    }
    return webhookToPatch.save();
  }
}
