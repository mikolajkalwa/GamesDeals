import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Deal extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  redditId: string;

  @Prop({
    required: true,
  })
  redditTitle: string;

  @Prop({
    required: true,
  })
  gameUrl: string;
}

export const DealSchema = SchemaFactory.createForClass(Deal);
