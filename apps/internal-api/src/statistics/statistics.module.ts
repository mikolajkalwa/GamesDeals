import { Module } from '@nestjs/common';
import PrismaModule from '../prisma/prisma.module';
import StatisticsController from './statistics.controller';
import StatisticsService from './statistics.service';

@Module({
  imports: [PrismaModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export default class StatisticsModule {}
