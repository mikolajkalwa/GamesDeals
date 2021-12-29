import { Module } from '@nestjs/common';
import PrismaModule from 'src/prisma/prisma.module';
import DealsController from './deals.controller';
import DealsService from './deals.service';

@Module({
  imports: [PrismaModule],
  controllers: [DealsController],
  providers: [DealsService],
})
export default class DealsModule { }
