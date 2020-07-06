import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })

export class Webhook extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  webhookId: string;

  @Prop({
    required: true,
  })
  webhookToken: string;

  @Prop({
    required: true,
    unique: false,
  })
  guildId: string;

  @Prop({
    required: false,
    unique: false,
  })
  roleToMention?: string;

  @Prop({
    required: false,
    unique: false,
    type: [String],
    validate: {
      validator: (val) => val.length <= 5, // allow only to store 5 keywords
      message: 'array size exceeds the limit of 5',
    },
  })
  keywords?: string[];
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);
