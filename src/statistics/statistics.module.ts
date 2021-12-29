import { Module } from '@nestjs/common';
import PrismaModule from 'src/prisma/prisma.module';
import StatisticsController from './statistics.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StatisticsController],
})
export default class StatisticsModule { }
