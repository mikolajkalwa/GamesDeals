import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DealsController from './deals.controller';
import DealsService from './deals.service';
import { Deal, DealSchema } from './schemas/deal.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }])],
  controllers: [DealsController],
  providers: [DealsService],
})
export default class DealsModule { }
