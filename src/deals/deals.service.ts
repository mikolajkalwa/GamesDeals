import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateDealDto from './dto/create-deal.dto';
import { Deal } from './schemas/deal.schema';

@Injectable()
export default class DealsService {
  constructor(@InjectModel(Deal.name) private readonly DealModel: Model<Deal>) { }

  async create(creatDealDto: CreateDealDto): Promise<Deal> {
    const createdDeal = new this.DealModel(creatDealDto);
    return createdDeal.save();
  }

  async find(redditId: string): Promise<Deal> {
    const deal = await this.DealModel.findOne({ redditId });
    if (!deal) {
      throw new NotFoundException('No deal found.');
    }
    return deal;
  }

  async findLatest(): Promise<Deal> {
    return this.DealModel.findOne({}).sort({ _id: -1 });
  }

  async findLatests(limit = 1): Promise<Deal[]> {
    return this.DealModel.find({}).limit(limit).sort({ _id: -1 });
  }

  async count(): Promise<number> {
    const dealsCount = await this.DealModel.countDocuments({});
    return dealsCount;
  }
}
